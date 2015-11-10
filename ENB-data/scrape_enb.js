data=artoo.scrape("div table tr",function($){
	t=$(this).find("td:eq(0)").text()
	if(t.indexOf("Volume")<0)
	{
		return {type:"title",title:t};
	}
	else
	{	
		var infos=t.replace(/\n/g,"").trim();
		//console.log(infos)
		// re_results=infos.match(/.*Number (\d{1-3}).*\d{4} *?([ \wéñ\/]*), *?([ \w]*)/i)
		// if(!re_results)
		// 	console.log(infos)
		// if(cells[4].indexOf(",")>-1)
		// {
		// 	var place=cells[4].split(",");
		// 	var country=place[place.length-1].trim();
		// 	var city=place[place.length-2].trim();
		// }
		// else
		// {
		// 	console.log(", not found",cells)
		// 	var country=city=cells[4]
		// }
		// return 	{
		// 	url: "http://www.iisd.ca"+$(this).find('a:eq(1)').attr("href"),
		// 	type : "info",
		// 	volume_number : cells[1].trim(),
		// 	short_title : cells[2].trim(),
		// 	date : cells[3].trim(),
		// 	city : city,
		// 	country : country
		// };
		return {type:"info",infos:infos,url: "http://www.iisd.ca"+$(this).find('td:eq(2) a').attr("href")}
	}

});


var current_title="";
var clean_data=[]
var index_title=0
for(var i=0; i<data.length;i++)
{
	if(data[i].type=="title")
	{
		current_title=data[i].title
		index_title+=1
		
	}
	else
	{
		data[i].long_title=current_title;
		data[i].index_title=index_title;
		clean_data.push(data[i]);
	}
}

