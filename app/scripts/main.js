var lines = {
	options : {
		nflUrl : 'http://www.nicklemke.com/test/bovada/bovadaLines.php?sport=nfl',
		nhlUrl : 'http://www.nicklemke.com/test/bovada/bovadaLines.php?sport=nhl'
	},
	parseResponse : function (response){
		this.rawData = response;
		var output = '';

		output += '<div class=\'games\'>';
		$(response.EventType.Date).each(function(){
			output += '<div class=\'date\'><h4>'+this['@attributes'].DTEXT+'</h4></date>';
			$(this.Event).each(function(){
				var totalNumber,
					overLine,
					underLine;

				$(this.Line.Choice).each(function(index){
					totalNumber = this['@attributes'].NUMBER;

					if(index === 0){
						overLine = this.Odds['@attributes'].Line;
					} else {
						underLine = this.Odds['@attributes'].Line;
					}
				});

				output += '<div class=\'game clearfix\'>';
				output += '<div class=\'gameTime\'>'+this.Time['@attributes'].TTEXT+'</div>';

				$(this.Competitor).each(function(index){
					output += '<div class=\'competitor clearfix\'>';
					output += '<div class=\'teamName\'><img src=\'images/'+lines.sport+'_logos/'+this['@attributes'].CODE1+'.svg\' />'+this['@attributes'].NAME+'</div>';

					if(index === 0){
						output += '<div class=\'overUnderHolder\'>';
						output += '<div class=\'overUnder\'><div class=\'left\'>'+totalNumber+'</div><div class=\'right\'><div>'+overLine+'</div><div>'+underLine+'</div></div></div>';
						output += '</div>';
					}

					$(this.Line).each(function(){
						if(this['@attributes'].TYPE === 'Moneyline'){
							if(typeof this.Choice !== 'undefined'){
								output += '<div class=\'moneyline\'>'+this.Choice['@attributes'].VALUE+'</div>';
							} else {
								output += '<div class=\'moneyline\'></div>';
							}
						} else if(this['@attributes'].TYPE === 'Pointspread') {
							output += '<div class=\'spread\'>'+this.Choice['@attributes'].VALUE+'</div>';
						}
					});
					output += '</div>';
				});
				output += '</div>';
			});
		});

		output += '</div>';
		this.html = output;
	},
	injectHtml : function(domSelector){
		$(domSelector).html(this.html);
	}
};



console.log('foo',lines);

$(document).ready(function(){
	var sport;
	if(location.search.indexOf('nfl') > -1) {
		sportLines = lines.options.nflUrl;
		lines.sport = 'nfl';
	} else if(location.search.indexOf('nhl') > -1) {
		sportLines = lines.options.nhlUrl;
		lines.sport = 'nhl';
	}
	$.ajax({
		url: sportLines,
		dataType: 'json',
		type: 'GET',
		success: function(response){
			console.log(response);
			lines.parseResponse(response);
			lines.injectHtml('.bettingLines');
		}
	});
});