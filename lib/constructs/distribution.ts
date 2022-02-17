import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import {
  CachePolicy,
  Distribution as CloudfrountDistribution,
  FunctionEventType,
  HttpVersion,
  IFunction,
  PriceClass,
  SecurityPolicyProtocol,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import {
  HostedZone,
  RecordSet,
  RecordTarget,
  RecordType,
} from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { GetStoreValue } from '../../customResources';
import { EnvNames, Regions } from '../../src/_types';

interface DistributionProps {
  allowedMethods: HttpMethods[];
  appName: string;
  domain: string;
  envName: EnvNames;
  nakedDomain?: boolean;
  orgName: string;
  subdomain?: string;
  viewerRequest?: IFunction;
  viewerResponse?: IFunction;
  websiteHosting?: boolean;
  websiteRedirect?: boolean;
}

type FunctionAssociations = {
  eventType: FunctionEventType;
  function: IFunction;
}[];

export class Distribution extends Construct {
  constructor(scope: Construct, id: string, props: DistributionProps) {
    super(scope, id);

    const {
      allowedMethods,
      appName,
      domain,
      envName,
      nakedDomain,
      orgName,
      subdomain,
      viewerRequest,
      viewerResponse,
      websiteHosting,
      websiteRedirect,
    } = props;

    //* Retrieve ssl cert
    const certificate = Certificate.fromCertificateArn(
      this,
      'certificate',
      new GetStoreValue(this, 'certificateARN', {
        parameterName: `/certificate/${domain}/certificateARN`,
        region: Regions.USE_1,
      }).value
    );

    //* Retrieve hosted zone
    const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'hostedZone', {
      hostedZoneId: new GetStoreValue(this, 'hostedZoneId', {
        parameterName: `/hostedZone/${domain}/hostedZoneId`,
        region: Regions.USE_1,
      }).value,
      zoneName: new GetStoreValue(this, 'zoneName', {
        parameterName: `/hostedZone/${domain}/hostedZoneName`,
        region: Regions.USE_1,
      }).value,
    });

    const bucket = new Bucket(this, 'bucket', {
      autoDeleteObjects: true,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true,
      },
      bucketName: nakedDomain
        ? `${orgName}--${appName}--naked.${domain}`
        : `${orgName}--${appName}--${subdomain}.${domain}`,
      cors: [
        {
          allowedHeaders: ['*'],
          allowedMethods,
          allowedOrigins: ['*'],
        },
      ],
      publicReadAccess: false,
      removalPolicy: RemovalPolicy.DESTROY,
      websiteRedirect: websiteRedirect
        ? { hostName: `${subdomain}.${domain}` }
        : undefined,
    });

    const cloudfrontParams = {
      certificate,
      comment: nakedDomain
        ? `naked.${domain} / ${envName}`
        : `${subdomain}.${domain} / ${envName}`,
      defaultBehavior: {
        cachePolicy: CachePolicy.fromCachePolicyId(
          this,
          `managed-policy-${subdomain}`,
          '658327ea-f89d-4fab-a63d-7e88639e58f6'
        ),
        compress: true,
        origin: new S3Origin(bucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: websiteRedirect ? [domain] : [`${subdomain}.${domain}`],
      enabled: true,
      httpVersion: HttpVersion.HTTP2,
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2019,
      priceClass: PriceClass.PRICE_CLASS_ALL,
    };

    if (websiteHosting) {
      Object.assign(cloudfrontParams, {
        defaultRootObject: 'index.html',
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: '/index.html',
            ttl: Duration.seconds(10),
          },
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: '/index.html',
            ttl: Duration.seconds(10),
          },
        ],
      });
    }

    const defaultBehavior = {
      cachePolicy: CachePolicy.fromCachePolicyId(
        this,
        'id-managedCachePolicy1',
        '658327ea-f89d-4fab-a63d-7e88639e58f6'
      ),
      compress: true,
      origin: new S3Origin(bucket),
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    };

    const functionAssociations: FunctionAssociations = [];

    if (viewerRequest) {
      functionAssociations.push({
        eventType: FunctionEventType.VIEWER_REQUEST,
        function: viewerRequest,
      });
    }

    if (viewerResponse) {
      functionAssociations.push({
        eventType: FunctionEventType.VIEWER_RESPONSE,
        function: viewerResponse,
      });
    }

    if (functionAssociations.length) {
      Object.assign(defaultBehavior, {
        functionAssociations,
      });
    }

    Object.assign(cloudfrontParams, {
      defaultBehavior,
    });

    const cloudFront = new CloudfrountDistribution(
      this,
      'cloudFront',
      cloudfrontParams
    );

    new RecordSet(this, 'route53RecordSet', {
      recordName: nakedDomain ? undefined : subdomain,
      recordType: RecordType.A,
      target: RecordTarget.fromAlias(new CloudFrontTarget(cloudFront)),
      zone: hostedZone,
    });
  }
}
