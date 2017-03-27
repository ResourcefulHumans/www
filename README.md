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

## Preview

For every PR a preview instance is created.
