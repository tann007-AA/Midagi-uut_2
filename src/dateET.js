//function tellDateET(){
const tellDateET = function(){
	let timeNow = new Date();
	const monthNamesET = ["jaanuar", "veebruar", "mأ¤rts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
	return timeNow.getDate() + ". " + monthNamesET[timeNow.getMonth()] + " " + timeNow.getFullYear();
}

const tellWeekDayET = function(){
	let timeNow = new Date();
	const weekdayNamesEt = ["puhapaev", "esmaspaev", "teisipaev", "kolmapaev", "neljapaev", "reede", "laupaev"];
	return weekdayNamesEt[timeNow.getDay()];
}

const tellTimeET = function(){
	let timeNow = new Date();
	return timeNow.getHours() + ":" + timeNow.getMinutes() + ":" + timeNow.getSeconds();
}

module.exports = {longDate: tellDateET, weekDay: tellWeekDayET, time: tellTimeET};