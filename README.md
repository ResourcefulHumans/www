# www

[![Build Status](https://travis-ci.org/ResourcefulHumans/www.svg)](https://travis-ci.org/ResourcefulHumans/www)
[![monitored by greenkeeper.io](https://img.shields.io/badge/greenkeeper.io-monitored-brightgreen.svg)](http://greenkeeper.io/) 
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

This is the source code for resourceful-humans.com and networhk.net.

The designs for both websites are very similiar so this projects is able to deployment both of them.

## Live

The websites are hosted on AWS S3, and served via a CloudFront distribution to provide custom domain names. SSL certificates are provided for free by the [AWS Certificate Manager](https://console.aws.amazon.com/acm/home?region=us-east-1).

For `wwww.resourceful-humans.com` a S3 bucket and a CloudFront distribution is configured to redirect all request to `resourceful-humans.com`, including SSL.

For `wwww.networhk.net` a S3 bucket is configured to redirect all request to `networhk.net`.

The DNS settings for both domains are managed via [Route 53](https://console.aws.amazon.com/route53/home?region=us-east-1#hosted-zones:).

<table>
<thead>
<tr>
<th></th><th>RH</th><th>RH / www :leftwards_arrow_with_hook:</th><th>netwoRHk</th><th>netwoRHk / www :leftwards_arrow_with_hook:</th>
</tr>
</thead>
<tbody>
<tr><td>:earth_africa:</td><td><a href="https://resourceful-humans.com/">https://resourceful-humans.com/</a></td><td><a href="https://www.resourceful-humans.com/">https://www.resourceful-humans.com/</a></td><td><a href="https://networhk.net/">https://networhk.net/</a></td><td><a href="http://www.networhk.net/">http://www.networhk.net/</a></td></tr>
<tr><td> S3 bucket </td><td> <a href="https://console.aws.amazon.com/s3/buckets/2016.resourceful-humans.com/?region=eu-central-1&tab=overview"><code>2016.resourceful-humans.com</code></a> </td><td> <a href="https://console.aws.amazon.com/s3/buckets/www.resourceful-humans.com/?region=eu-central-1&tab=overview"><code>www.resourceful-humans.com</code></a> </td><td> <a href="https://console.aws.amazon.com/s3/buckets/networhk.net/?region=eu-central-1&tab=overview"><code>networhk.net</code></a> </td><td> <a href="https://console.aws.amazon.com/s3/buckets/www.networhk.net/?region=eu-central-1&tab=overview"><code>www.networhk.net</code></a> </td></tr>
<tr><td> CloudFront Distribution </td><td> <a href="https://console.aws.amazon.com/cloudfront/home?region=eu-central-1#distribution-settings:ET6WSBUMXPIW"><code>ET6WSBUMXPIW</code></a> </td><td> <a href="https://console.aws.amazon.com/cloudfront/home?region=eu-central-1#distribution-settings:E2RCK5OSBFW3M5"><code>E2RCK5OSBFW3M5</code></a> </td><td> <a href="https://console.aws.amazon.com/cloudfront/home?region=eu-central-1#distribution-settings:E3TJYAKPKCTWDU"><code>E3TJYAKPKCTWDU</code></a> </td><td> - </td></tr>
<tr><td> :lock: SSL Certificate </td><td colspan="2"> <a href="https://console.aws.amazon.com/acm/home?region=us-east-1#/?id=af652463-df6d-4377-858d-4b75f08fb30d"><code>af652463-df6d-4377-858d-4b75f08fb30d</code></a> </td><td> <a href="https://console.aws.amazon.com/acm/home?region=us-east-1#/?id=9088401d-6917-482f-a45c-f8a4c976ab23"><code>9088401d-6917-482f-a45c-f8a4c976ab23</code></a> </td><td> - </td></tr>
<tr><td> DNS configuration </td><td colspan="2"> <a href="https://console.aws.amazon.com/route53/home?region=us-east-1#resource-record-sets:Z2LAFOE4409T7H"><code>Z2LAFOE4409T7H</code></a> </td><td colspan="2"> <a href="https://console.aws.amazon.com/route53/home?region=us-east-1#resource-record-sets:Z31RXI59NWRVN5"><code>Z31RXI59NWRVN5</code></a> </td></tr>
</tbody>
</table>

### Connected Services

The contact form on the page sends contact requests to the [#_opportunities Slack channel](https://rhway.slack.com/messages/C0JUJ7J3D/) via the [`wwwContactForm`](https://eu-central-1.console.aws.amazon.com/lambda/home?region=eu-central-1#/functions/wwwContactForm?tab=code) lambda function whose HTTP endpoint is provided via the [`www-contactform@prod`](https://eu-central-1.console.aws.amazon.com/apigateway/home?region=eu-central-1#/apis/2sy0mc1zj8/stages/prod) API Gateway stage. 

### Deployment

:rocket: Deployment for this package is automated via [Travis CI](https://github.com/ResourcefulHumans/www/blob/master/.travis.yml).  
**Every commit can potentially trigger a deploy.**

If *lint* is run without an error, and Travis is building a tag, `make deploy` will be executed to publish the RH and netwoRHk websites. Travis [provides the environment variable `TRAVIS_TAG`](https://docs.travis-ci.com/user/environment-variables/#Default-Environment-Variables) which is used to determine if a tag is built.

It uses [`s3cmd`](http://s3tools.org/s3cmd) to publish the build to S3. `s3cmd` uses [the standard AWS environment variables](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-environment) for authentication.  They and the `API_ENDPOINT` environment variables are required:

 * `AWS_ACCESS_KEY_ID`  
   The AWS access key to use
 * `AWS_SECRET_ACCESS_KEY`  
   The AWS secret access key to use
 * `API_ENDPOINT`  
   The endpoint for the contact form submissions

The AWS credentials for Travis are taken from the [`travis-ci`](https://console.aws.amazon.com/iam/home?region=eu-central-1#/users/travis-ci) user.
     
You can create new AWS keys via [IAM](https://console.aws.amazon.com/iam/home?region=eu-central-1). Assign the new user to the groups [`www`](https://console.aws.amazon.com/iam/home?region=eu-central-1#/groups/www?section=permissions) and [`networhk`](https://console.aws.amazon.com/iam/home?region=eu-central-1#/groups/networhk?section=permissions) which have the neccessary permission to update S3.

## Preview

If Travis is building a pull request, a preview instance will be created. This is achieved by create an new S3 bucket with the PRs number. The `make preview` task will publish the URL in the PRs comments, [like this](https://github.com/ResourcefulHumans/www/pull/4#issuecomment-254817438).
