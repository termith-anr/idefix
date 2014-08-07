<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
	xmlns:html="http://www.w3.org/TR/REC-html40"
	xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
	xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<title>XML Sitemap</title>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
				<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.13.3/css/theme.default.css"/>					
				<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
				<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.13.3/jquery.tablesorter.min.js"></script>
				<script	type="text/javascript"><![CDATA[ $(document).ready(function() { $("#sitemap").tablesorter({ widgets: ['zebra'] }); }); ]]></script>
				<style type="text/css"><![CDATA[
					body {
					color: #545353;
					}
					#content {
					margin: 0 auto;
					width: 1000px;
					}
					p {
					margin: 10px 3px;
					line-height: 1.3em;
					}
					p a {
					color: #da3114;
					font-weight: bold;
					}
					]]></style>
			</head>
			<body>
				<div id="content">
					<h1>XML Sitemap</h1>
					<p>
						You can find more information about XML sitemaps on <a href="http://sitemaps.org">sitemaps.org</a>.
					</p>
					<p>
						This sitemap contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs.
					</p>			
					<table id="sitemap" cellpadding="3">
						<thead>
							<tr>
								<th width="75%">URL</th>
								<th width="5%">Priority</th>
								<th width="5%">Images</th>
								<th width="5%">Change Freq.</th>
								<th width="10%">Last Change</th>
							</tr>
						</thead>
						<tbody>
							<xsl:variable name="lower" select="'abcdefghijklmnopqrstuvwxyz'"/>
							<xsl:variable name="upper" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"/>
							<xsl:for-each select="sitemap:urlset/sitemap:url">
								<tr>
									<td>
										<xsl:variable name="itemURL">
											<xsl:value-of select="sitemap:loc"/>
										</xsl:variable>
										<a href="{$itemURL}">
											<xsl:value-of select="sitemap:loc"/>
										</a>
									</td>
									<td>
										<xsl:value-of select="concat(sitemap:priority*100,'%')"/>
									</td>
									<td>
										<xsl:value-of select="count(image:image)"/>
									</td>
									<td>
										<xsl:value-of select="concat(translate(substring(sitemap:changefreq, 1, 1),concat($lower, $upper),concat($upper, $lower)),substring(sitemap:changefreq, 2))"/>
									</td>
									<td>
										<xsl:value-of select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)))"/>
									</td>
								</tr>
							</xsl:for-each>
						</tbody>
					</table>
					<p>
						View based on the work of <a href="https://yoast.com/xsl-stylesheet-xml-sitemap/">Yoast</a>.
					</p>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
