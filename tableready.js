/*
Spring OOSD Team 4
PROJ-207-OOS - Thread Project fo OOSD
Date: June 2020
Author: Gustavo Lourenco Moises
SAIT ID: 849950
Database file: tableready.sql

TableReady Module responsible for:
1) Show the restaurant layout:
	localhost:8000/restaurant
2) Show the table status in a a table:
	localhost:8000/tableavailable
3) Show the table status in a table and the restaurant layout:
	localhost:8000/tableavailablelayout
4) Change the table status in a form:
	localhost:8000/tableavailableform
5) Change the table status in a form and show the restaurant layout:
	localhost:8000/tableavailableformlayout
6) Show the table seating information in a table:
	localhost:8000/tableseating
7) Show the table seating information in a table and the restaurant layout:
	localhost:8000/tableseatinglayout
8) Set the table to a reservation/waitlist entry in a form
	localhost:8000/tableseatingform
9) Set the table to a reservation/waitlist entry in a form and show the restaurant layout
	localhost:8000/tableseatingformlayout
*/


/*
This is the main entry point into the application.
It uses mysql, express, pug and an mvc structure.
*/
const util = require('util');
const  mysql = require("mysql");

/*
express is brought in and used to create a server that listens on port 8000
*/
const express = require("express");
const app = express();
const path = require("path");



//Parse JSON
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(8000, ()=>{ console.log("server running on port 8000"); });
app.use(express.static("media", { extensions: ["png", "jpg"] }));

app.use(express.json());

//this causes the request body to be decoded
app.use(express.urlencoded({extended: true}));


/*
this app uses the PUG template engine to insert values into the html.
The pug files are in the views directory
*/
console.log(__dirname);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

/*Global variables*/
var type;
/*Variables of the tableavailable*/
var x;
var y;
var z;
var w;
var pass;
var message;

/*Variables of the tableseating*/
var tableStatus;
var cluster1table;
var tablePositon;
var clusterPosition;
var clustermore;
var layoutActive;
var position;
var WaitId;
var ResId;
var X;
var Y;
var Z;
var ClusP;
var tablemessage;



/* Connection with MYSQL database*/
var pool        = mysql.createPool({
    connectionLimit : 10,
	dateStrings: true,
    multipleStatements: true,
    host            : 'localhost',
    user            : 'harv3',
    password        : 'password',
    database        : 'tableready'
});

/*Initial Messages*/
tablemessage="Define table Status";
message="Set Table to Reservation/Wailist Entry";


app.get("/restaurant", (req, res)=>{
	type=0;
	
	// Query brings the tables status of the active restaurant layout
	tableStatus=[];
	pool.getConnection((err, conn)=>{
		if (err) throw err;
		var sql = "SELECT DISTINCT TEMP2.TABLEID, TEMP2.TABLEAVAILABILITYSTATUS, TEMP2.tableCheckoutStatus, TEMP2.tableCleaningStatus,TEMP2.`clusterId` from `restaurants` AS RT JOIN `layoutclusters` as TA ON TA.`layoutId`=RT.`layoutActive` JOIN  `clustertables` as TB on TA.`clusterId`=TB.`clusterId` join ( SELECT TA.* FROM `tableavailability`as  TA JOIN( SELECT `tableId`, max(`dateTime`) AS dateTime FROM `tableavailability` Group by  `tableId`) AS temp ON (TA.tableId=temp.tableId) AND (TA.dateTime = temp.dateTime)) as temp2 on temp2.tableId = tb.tableId WHERE RT.`restaurantId`=1";
		conn.query(sql, (err, result, fields)=>{
			conn.release();
			if (err) throw err;
			tableStatus=result;
			//res.render("tableavailableform",{ nos: result});
		});
	});
	
	res.redirect("/restaurantlayout");
});

/*Show the restaurant layout*/
app.get("/restaurantlayout", (req, res)=>{

	
	//Query brings the active restaurant layout of the restaurant 
	layoutActive=[];
	pool.getConnection((err, conn)=>{
		if (err) throw err;
		var sql = "SELECT LY.`layoutimage` FROM `layouts` AS LY JOIN `restaurants` AS RT on RT.`layoutActive`=LY.`layoutId` WHERE RT.`restaurantId`=1";
		conn.query(sql, (err, layout, fields)=>{
			conn.release();
			if (err) throw err;
			layoutActive=layout;
		});
	});

	//Query brings the table position in the active layout of the restaurant and its status images
	tablePosition=[];
	pool.getConnection((err, conn)=>{
		if (err) throw err;
		var sql = "SELECT DISTINCT CT.`clusterId`,CT.`tableId`, TB.`tableName`,CT.tableX, CT.tableY, TB.`tableImage`, TB.`tableImageAvailable`, TB.`tableImageUnavailable`, TB.`tableImageCheckout`, TB.`tableImageCleaning` from `restaurants` AS RT join `layoutclusters` as LC ON LC.`layoutId`=RT.`layoutActive` join `clustertables` as CT on LC.`clusterId`=CT.`clusterId` join `tables` as TB on TB.`tableId`=CT.`tableId` WHERE RT.`restaurantId`=1 order by CT.`clusterId`";
		conn.query(sql, (err, tables, fields)=>{
			conn.release();
			if (err) throw err;
			tablePosition=tables;
		});
	});
	
	//Query brings the cluster position in the active layout of the restaurant and its image. Reminder: Every table is a cluster, so a cluster of one table should have xcluster=ycluster=clusterimage=null
	clusterPosition=[];
	pool.getConnection((err, conn)=>{
	if (err) throw err;
	var sql = "SELECT `clusterId`, `clusterName`,`clusterX`, `clusterY`, `clusterImage` FROM `restaurants` AS RT JOIN `layoutclusters` AS LC ON (RT.`layoutActive`=LC.`layoutId`) WHERE RT.`restaurantId`=1 order by `clusterId`";
	conn.query(sql, (err, clusters, fields)=>{
			conn.release();
			if (err) throw err;
			clusterPosition=clusters;
		});
	});
	
	//Query brings the clusters that has more than 1 table in the active layout of the restaurant
	clustermore=[];
	pool.getConnection((err, conn)=>{
	if (err) throw err;
	var sql = "SELECT DISTINCT CT.`clusterId` FROM `clustertables` AS CT JOIN( SELECT`clusterId`, COUNT(`tableId`) FROM `clustertables` GROUP BY `clusterId`HAVING COUNT(`tableId`) >1 ) AS T1 on T1.`clusterId`=CT.`clusterId` JOIN `layoutclusters` AS LC on T1.`clusterId`=CT.`clusterId` JOIN `restaurants` as RT on RT.`layoutActive`=LC.`layoutID` where RT.`restaurantId`=1 order by CT.`clusterId`";
	conn.query(sql, (err, cluster2, fields)=>{
			conn.release();
			if (err) throw err;
			clustermore=cluster2;
		});
	});
	res.redirect("/restaurantlayoutcalculation");
});

/*Defines the parameters for the restaurant layout*/
app.get("/restaurantlayoutcalculation", (req, res)=>{
	/*Local variables*/
	var img;
	var Images = []; 
	var ImagesClus =[];
	var clusterinsert=[];
	
	//Create an array of image files of the clusters 
	for (var i=0; i<Object.keys(clusterPosition).length; i++)
	{
		clusterinsert.push(0);
		ImagesClus.push("");
	}
		
	for (i=0; i<Object.keys(tableStatus).length; i++)
	{
		for (var z=0; z<Object.keys(clusterPosition).length; z++)
		{
			if(clusterPosition[z].clusterId==tableStatus[i].clusterId && clusterinsert[z]==0)
			{
				for (var j=0; j<Object.keys(clustermore).length; j++)
				{
					if(clustermore[j].clusterId==clusterPosition[z].clusterId )
					{
						//If the cluster is activated, change the cluster image file 
						img=clusterPosition[z].clusterImage;
						clusterinsert[z]=1;
						ImagesClus[z]=img;
					}
				}
			}		
		}
		//Choose the image file of the table related to the table status 
		if( tableStatus[i].tableAvailabilityStatus==1)
		{
			img=tablePosition[i].tableImageAvailable;
		}
		else{
			if( tableStatus[i].tableCleaningStatus==1)
			{
				img=tablePosition[i].tableImageCleaning;
			}
			else
			{
				if( tableStatus[i].tableCheckoutStatus==1)
				{
					img=tablePosition[i].tableImageCheckout;
				}
				else
				{
					img=tablePosition[i].tableImageUnavailable;
				}
			}	
		}
		Images.push(img);
	}
	

	if (type==0)
	{
		res.render("restaurantlayout",{T1 : Images[0], T2 : Images[1], T3 : Images[2], T4 : Images[3], T5 : Images[4], T6 : Images[5], C1 : ImagesClus[0], C2 : ImagesClus[1], C3 : ImagesClus[2], C4 : ImagesClus[3], C5 : ImagesClus[4], C6 : ImagesClus[5], C7 : ImagesClus[6], C8 : ImagesClus[7], C9 : ImagesClus[8], C10 : ImagesClus[9]});
	}
	else
	{
		if (type==2)
		{
			res.render("tableavailablelayout",{T1 : Images[0], T2 : Images[1], T3 : Images[2], T4 : Images[3], T5 : Images[4], T6 : Images[5], C1 : ImagesClus[0], C2 : ImagesClus[1], C3 : ImagesClus[2], C4 : ImagesClus[3], C5 : ImagesClus[4], C6 : ImagesClus[5], C7 : ImagesClus[6], C8 : ImagesClus[7], C9 : ImagesClus[8], C10 : ImagesClus[9], nos : tableStatus});
		}
		else
		{
			if (type==4)
			{
			res.render("tableavailableformlayout",{T1 : Images[0], T2 : Images[1], T3 : Images[2], T4 : Images[3], T5 : Images[4], T6 : Images[5], C1 : ImagesClus[0], C2 : ImagesClus[1], C3 : ImagesClus[2], C4 : ImagesClus[3], C5 : ImagesClus[4], C6 : ImagesClus[5], C7 : ImagesClus[6], C8 : ImagesClus[7], C9 : ImagesClus[8], C10 : ImagesClus[9],  nos: tableStatus, mess: tablemessage});
			}
			else
				{
				if (type==6)
				{
					res.render("tableseatinglayout",{T1 : Images[0], T2 : Images[1], T3 : Images[2], T4 : Images[3], T5 : Images[4], T6 : Images[5], C1 : ImagesClus[0], C2 : ImagesClus[1], C3 : ImagesClus[2], C4 : ImagesClus[3], C5 : ImagesClus[4], C6 : ImagesClus[5], C7 : ImagesClus[6], C8 : ImagesClus[7], C9 : ImagesClus[8], C10 : ImagesClus[9], nos: X, nus: Y, nys :Z, nws:ClusP, mens:message});
				}
				else
				{
					if (type==8)
					{
						res.render("tableseatingformlayout",{T1 : Images[0], T2 : Images[1], T3 : Images[2], T4 : Images[3], T5 : Images[4], T6 : Images[5], C1 : ImagesClus[0], C2 : ImagesClus[1], C3 : ImagesClus[2], C4 : ImagesClus[3], C5 : ImagesClus[4], C6 : ImagesClus[5], C7 : ImagesClus[6], C8 : ImagesClus[7], C9 : ImagesClus[8], C10 : ImagesClus[9], nos: X, nus: Y, nys :Z, nws:ClusP, mens:message});
					}
				}
			}
		}
	}	

});


/*Show the Status of the tables in a simple table*/
app.get("/tableavailable", (req, res)=>{

	type=1;
	// Query brings the tables status of the active restaurant layout
	tableStatus=[];
	pool.getConnection((err, conn)=>{
		if (err) throw err;
		const query = util.promisify(conn.query).bind(conn);
		var sql = "SELECT DISTINCT TEMP2.TABLEID, TEMP2.TABLEAVAILABILITYSTATUS, TEMP2.tableCheckoutStatus, TEMP2.tableCleaningStatus, TEMP2.clusterID from `restaurants` AS RT JOIN `layoutclusters` as TA ON TA.`layoutId`=RT.`layoutActive` JOIN  `clustertables` as TB on TA.`clusterId`=TB.`clusterId` join ( SELECT TA.* FROM `tableavailability`as  TA JOIN( SELECT `tableId`, max(`dateTime`) AS dateTime FROM `tableavailability` Group by  `tableId`) AS temp ON (TA.tableId=temp.tableId) AND (TA.dateTime = temp.dateTime)) as temp2 on temp2.tableId = tb.tableId WHERE RT.`restaurantId`=1";
		(async () => {
			try {
					const result = await query(sql);
					tableStatus=result;
					res.render("tableavailable",{ nos: tableStatus});
					
				}catch(e){
					throw e;
				} finally {
					conn.release();
				}
		})()
	});

});





/*Show the Status of the tables and the restaurant layout*/
app.get("/tableavailablelayout", (req, res)=>{
	type=2;
	// Query brings the tables status of the active restaurant layout
	tableStatus=[];
	pool.getConnection((err, conn)=>{
		if (err) throw err;
		const query = util.promisify(conn.query).bind(conn);
		var sql = "SELECT DISTINCT TEMP2.TABLEID, TEMP2.TABLEAVAILABILITYSTATUS, TEMP2.tableCheckoutStatus, TEMP2.tableCleaningStatus, TEMP2.clusterID from `restaurants` AS RT JOIN `layoutclusters` as TA ON TA.`layoutId`=RT.`layoutActive` JOIN  `clustertables` as TB on TA.`clusterId`=TB.`clusterId` join ( SELECT TA.* FROM `tableavailability`as  TA JOIN( SELECT `tableId`, max(`dateTime`) AS dateTime FROM `tableavailability` Group by  `tableId`) AS temp ON (TA.tableId=temp.tableId) AND (TA.dateTime = temp.dateTime)) as temp2 on temp2.tableId = tb.tableId WHERE RT.`restaurantId`=1";
		(async () => {
			try {
					const result = await query(sql);;
					tableStatus=result;
				}catch(e){
					throw e;
				} finally {
					conn.release();
				}
		})()
	});
		
	res.redirect("/restaurantlayout");

});

/*Form to change the Status of the tables*/
app.get("/tableavailableform", (req, res)=>{
	type=3;
	// Query brings the cluster that has only one table 
	cluster1table=[];
	pool.getConnection((err, conn)=>{
	if (err) throw err;
	var sql="SELECT  CT.`clusterId`, CT.`tableId` FROM `restaurants` AS RT JOIN `layoutclusters` AS LC on RT.`layoutActive`=LC.`layoutId` JOIN `clustertables` AS CT ON LC.`clusterId`=CT.`clusterId` JOIN(  SELECT`clusterId`, COUNT(`tableId`) FROM `clustertables` GROUP BY `clusterId`HAVING COUNT(`tableId`) =1 ) AS T1 on T1.`clusterId`=CT.`clusterId` WHERE RT.`restaurantId`=1";
	conn.query(sql, (err, result, fields)=>{
	conn.release();
	if (err) throw err;
		cluster1table=result;
		});
	});
	
	// Query brings the tables status of the active restaurant layout
	tableStatus=[];
	pool.getConnection((err, conn)=>{
		if (err) throw err;
		var sql = "SELECT DISTINCT TEMP2.TABLEID, TEMP2.TABLEAVAILABILITYSTATUS, TEMP2.tableCheckoutStatus, TEMP2.tableCleaningStatus, TEMP2.clusterID from `restaurants` AS RT JOIN `layoutclusters` as TA ON TA.`layoutId`=RT.`layoutActive` JOIN  `clustertables` as TB on TA.`clusterId`=TB.`clusterId` join ( SELECT TA.* FROM `tableavailability`as  TA JOIN( SELECT `tableId`, max(`dateTime`) AS dateTime FROM `tableavailability` Group by  `tableId`) AS temp ON (TA.tableId=temp.tableId) AND (TA.dateTime = temp.dateTime)) as temp2 on temp2.tableId = tb.tableId WHERE RT.`restaurantId`=1";
		conn.query(sql, (err, result, fields)=>{
			conn.release();
			if (err) throw err;
			tableStatus=result;
			//REVISE QUERY TO INCLUDE TABLENAME
			tableStatus[0].tableName="A6";
			tableStatus[1].tableName="B4";
			tableStatus[2].tableName="B2";
			tableStatus[3].tableName="C1";
			tableStatus[4].tableName="C2";
			tableStatus[5].tableName="C3";
			
			
			res.render("tableavailableform",{ nos: tableStatus, mess: tablemessage});
		});
	});
});


/*Form to change the Status of the tables*/
app.get("/tableavailableformlayout", (req, res)=>{
 type=4;
	// Query brings the tables status of the active restaurant layout
	tableStatus=[];
	pool.getConnection((err, conn)=>{
		if (err) throw err;
		var sql = "SELECT DISTINCT TEMP2.TABLEID, TEMP2.TABLEAVAILABILITYSTATUS, TEMP2.tableCheckoutStatus, TEMP2.tableCleaningStatus, TEMP2.clusterID from `restaurants` AS RT JOIN `layoutclusters` as TA ON TA.`layoutId`=RT.`layoutActive` JOIN  `clustertables` as TB on TA.`clusterId`=TB.`clusterId` join ( SELECT TA.* FROM `tableavailability`as  TA JOIN( SELECT `tableId`, max(`dateTime`) AS dateTime FROM `tableavailability` Group by  `tableId`) AS temp ON (TA.tableId=temp.tableId) AND (TA.dateTime = temp.dateTime)) as temp2 on temp2.tableId = tb.tableId WHERE RT.`restaurantId`=1";
		conn.query(sql, (err, result, fields)=>{
			conn.release();
			if (err) throw err;
			tableStatus=result;
			tableStatus=result;
			//REVISE QUERY TO INCLUDE TABLENAME
			tableStatus[0].tableName="A6";
			tableStatus[1].tableName="B4";
			tableStatus[2].tableName="B2";
			tableStatus[3].tableName="C1";
			tableStatus[4].tableName="C2";
			tableStatus[5].tableName="C3";
		});
	});
	
	// Query brings the cluster that has only one table 
	cluster1table=[];
	pool.getConnection((err, conn)=>{
	if (err) throw err;
	var sql="SELECT  CT.`clusterId`, CT.`tableId` FROM `restaurants` AS RT JOIN `layoutclusters` AS LC on RT.`layoutActive`=LC.`layoutId` JOIN `clustertables` AS CT ON LC.`clusterId`=CT.`clusterId` JOIN(  SELECT`clusterId`, COUNT(`tableId`) FROM `clustertables` GROUP BY `clusterId`HAVING COUNT(`tableId`) =1 ) AS T1 on T1.`clusterId`=CT.`clusterId` WHERE RT.`restaurantId`=1";
	conn.query(sql, (err, result, fields)=>{
	conn.release();
	if (err) throw err;
		cluster1table=result;
		});
	});
	

	res.redirect("/restaurantlayout");
});


/*Post that receives the user input and change the database*/
app.post("/tableavailabilityentry",(req, res)=>{
	/*local variables*/
	var clusternumber;
	clusternumber=[];
	
	// Bring the last Wailist ID associated to table from req.body.tableId
	WaitId=[];
	pool.getConnection((err, conn)=>{
		if (err) throw err;
		var sql = "SELECT WE.`waitlistId`, WE.`seatingDateTime`,WE.`checkoutDateTime` FROM `restaurants` AS RT JOIN `waitlistentries` AS WE ON RT.`restaurantID`=WE.`restaurantId` JOIN `waitlistentrytables` AS WET ON WE.`waitlistId`=WET.`waitlistID` WHERE WET.`tableId`=" + req.body.tableId + " ORDER BY  WE.`seatingDateTime` DESC LIMIT 1;";
		conn.query(sql, (err, results, fields)=>{
			conn.release();
			if (err) throw err;
			WaitId=results;
		});
	});
	
		// Bring the last Reservation ID associated to table from req.body.tableId
	ResId=[];
	pool.getConnection((err, conn)=>{
		if (err) throw err;
		var sql = "SELECT RE.`reservationId`, RE.`seatingDateTime`, RE.`checkoutDateTime` FROM `restaurants` AS RT JOIN `reservationentries` AS RE ON RT.`restaurantID`=RE.`restaurantId` JOIN `reservationentrytables` AS RET ON RE.`reservationId`=RET.`reservationID` WHERE RET.`tableId`=" +  req.body.tableId + " ORDER BY  RE.`seatingDateTime` DESC LIMIT 1;";
		conn.query(sql, (err, results, fields)=>{
			conn.release();
			if (err) throw err;
			ResId=results;
		});
	});

	
	/*Data entry check*/
	if (!req.body.tableId)
	{
		tablemessage= "ERROR: Invalid table Id. Choose a valid tableID";
		if (type==1)
		{
			res.redirect("/tableavailable");
		}
		else
		{
			if (type==2)
			{
				res.redirect("/tableavailablelayout");
			}
			else
			{
				if (type==3)
				{
				res.redirect("/tableavailableform");
				}
				else
				{
					if (type==4)
					{
					res.redirect("/tableavailableformlayout");
					}
				}
			}
		}
	}
	else
	{	
		if (!req.body.tableAvailabilityStatus)
		{
			tablemessage= "ERROR: The availability status is a required input. In the table availability Status, please, type 1 if the table is available and 0, if not";
			if (type==1)
			{
				res.redirect("/tableavailable");
			}
			else
			{
				if (type==2)
				{
					res.redirect("/tableavailablelayout");
				}
				else
				{
					if (type==3)
					{
					res.redirect("/tableavailableform");
					}
					else
					{
						if (type==4)
						{
						res.redirect("/tableavailableformlayout");
						}
					}
				}
			}
		}
		else
		{
			if(req.body.tableAvailabilityStatus==1)
			{
				for(i=0;i<Object.keys(cluster1table).length; i++)
				{
					if (cluster1table[i].tableId == req.body.tableId)
					{
						clusternumber=cluster1table[i].clusterId;
					}
				}
				//If Availability status is 1, the checkout and cleaning status are irrelevant
				pool.getConnection((err, conn)=>{
					if (err) throw err;
					//Insert an availability status for table inserted in the form
					var sql = "INSERT INTO `tableavailability`(`tableId`, `tableAvailabilityStatus`, `tableCheckoutStatus`, `tableCleaningStatus`,`clusterId`) VALUES ("+ req.body.tableId +","+ req.body.tableAvailabilityStatus +",0,0," + clusternumber + ")";
					//console.log(sql);
					conn.query(sql, (err)=>{
							conn.release();
							if (err) throw err;
						});
				});
				tablemessage="Define table Status";
				//Verify with the user checked the NOSHOW box
				if (!req.body.noshow)
				{
					//GO to the checkout procedure
					res.redirect("/checkout");
				}
				else
				{
					//GO to the NOSHOW procedure
					res.redirect("/NoShow");
				}
					
			}
			else
			{
				if(req.body.tableAvailabilityStatus==0)
				{
					for(i=0;i<Object.keys(tableStatus).length; i++)
					{
						if (tableStatus[i].tableId == req.body.tableId)
						{
						clusternumber=tableStatus[i].clusterId;
						}
					}
					if (!req.body.tableCheckoutStatus)
					{
						if (!req.body.tableCleaningStatus)
						{
							//If Availability status is 0, checkout status is NULL and cleaning status is NULL, checkout and cleaning status are considered equal to 0
							pool.getConnection((err, conn)=>{
								if (err) throw err;
								//Insert an availability status for table from req.body.tableId
								var sql = "INSERT INTO `tableavailability`(`tableId`, `tableAvailabilityStatus`, `tableCheckoutStatus`, `tableCleaningStatus`,`clusterId`) VALUES ("+ req.body.tableId +","+ req.body.tableAvailabilityStatus +",0,0," + clusternumber + ")";
								//console.log(sql);
								conn.query(sql, (err)=>{
									conn.release();
									if (err) throw err;
								});
							});
							tablemessage="Define table Status";
							if (type==1)
							{
								res.redirect("/tableavailable");
							}
							else
							{
								if (type==2)
								{
									res.redirect("/tableavailablelayout");
								}
								else
								{
									if (type==3)
									{
									res.redirect("/tableavailableform");
									}
									else
									{
										if (type==4)
										{
										res.redirect("/tableavailableformlayout");
										}
									}
								}
							}
						}
						else
						{
							if(req.body.tableCleaningStatus==0) 
							{
								//If Availability status is 0, checkout status is NULL and cleaning status is 0, checkout status is considered equal to 0
								pool.getConnection((err, conn)=>{
									if (err) throw err;
									//Insert an availability status for table from req.body.tableId
									var sql = "INSERT INTO `tableavailability`(`tableId`, `tableAvailabilityStatus`, `tableCheckoutStatus`, `tableCleaningStatus`,`clusterId`) VALUES ("+ req.body.tableId +","+ req.body.tableAvailabilityStatus +",0,"+ req.body.tableCleaningStatus+ "," + clusternumber + ")";
									//console.log(sql);
									conn.query(sql, (err)=>{
										conn.release();
										if (err) throw err;
									});
								});
								tablemessage="Define table Status";
								if (type==1)
								{
									res.redirect("/tableavailable");
								}
								else
								{
									if (type==2)
									{
										res.redirect("/tableavailablelayout");
									}
									else
									{
										if (type==3)
										{
										res.redirect("/tableavailableform");
										}
										else
										{
											if (type==4)
											{
											res.redirect("/tableavailableformlayout");
											}
										}
									}
								}
							}
							else
							{
								if(req.body.tableCleaningStatus==1) 
								{
									//If Availability status is 0, checkout status is NULL and cleaning status is 1, checkout status is considered equal to 0
									pool.getConnection((err, conn)=>{
										if (err) throw err;
										//Insert an availability status for table from req.body.tableId
										var sql = "INSERT INTO `tableavailability`(`tableId`, `tableAvailabilityStatus`, `tableCheckoutStatus`, `tableCleaningStatus`,`clusterId`) VALUES ("+ req.body.tableId +","+ req.body.tableAvailabilityStatus +",0,"+ req.body.tableCleaningStatus+ "," + clusternumber + ")";
										//console.log(sql);
											conn.query(sql, (err)=>{
												conn.release();
												if (err) throw err;
											});
										});
									tablemessage="Define table Status";
									if (type==1)
									{
										res.redirect("/tableavailable");
									}
									else
									{
										if (type==2)
										{
											res.redirect("/tableavailablelayout");
										}
										else
										{
											if (type==3)
											{
											res.redirect("/tableavailableform");
											}
											else
											{
												if (type==4)
												{
												res.redirect("/tableavailableformlayout");
												}
											}
										}
									}
								}
								else
								{
									tablemessage= "ERROR: Invalid cleaning status. In the cleaning Status, please, type 1 if the table is under cleaning and 0, if not";
									if (type==1)
									{
										res.redirect("/tableavailable");
									}
									else
									{
										if (type==2)
										{
											res.redirect("/tableavailablelayout");
										}
										else
										{
											if (type==3)
											{
											res.redirect("/tableavailableform");
											}
											else
											{
												if (type==4)
												{
												res.redirect("/tableavailableformlayout");
												}
											}
										}
									}
								}
							}
						}
					}
					else
					{
						if(req.body.tableCheckoutStatus==0 || req.body.tableCheckoutStatus==1)
						{
							if (!req.body.tableCleaningStatus)
							{
								//If Availability status is 0, checkout status is 0 or 1 and cleaning status is NULL, cleaning status is considered equal to 0
								pool.getConnection((err, conn)=>{
									if (err) throw err;
									//Insert an availability status for table from req.body.tableId
									var sql = "INSERT INTO `tableavailability`(`tableId`, `tableAvailabilityStatus`, `tableCheckoutStatus`, `tableCleaningStatus`,`clusterId`) VALUES ("+ req.body.tableId +","+ req.body.tableAvailabilityStatus +","+ req.body.tableCheckoutStatus +",0," + clusternumber + ")";
									//console.log(sql);
									conn.query(sql, (err)=>{
										conn.release();
										if (err) throw err;
									});
								});
								tablemessage="Define table Status";
								if(req.body.tableCheckoutStatus==1)
								{
									//GO to the checkout procedure
									res.redirect("/checkout");
								}
								else
								{
									if (type==1)
									{
										res.redirect("/tableavailable");
									}
									else
									{
										if (type==2)
										{
											res.redirect("/tableavailablelayout");
										}
										else
										{
											if (type==3)
											{
											res.redirect("/tableavailableform");
											}
											else
											{
												if (type==4)
												{
												res.redirect("/tableavailableformlayout");
												}
											}
										}
									}
								}
							}
							else
							{
								if(req.body.tableCleaningStatus==1 && req.body.tableCheckoutStatus==1)
								{
									tablemessage= "ERROR: Cleaning and checkout status cannot be equal to 1 simultaneously. ";
									if (type==1)
									{
										res.redirect("/tableavailable");
									}
									else
									{
										if (type==2)
										{
											res.redirect("/tableavailablelayout");
										}
										else
										{
											if (type==3)
											{
											res.redirect("/tableavailableform");
											}
											else
											{
												if (type==4)
												{
												res.redirect("/tableavailableformlayout");
												}
											}
										}
									}
								}
								else
								{
									//If Availability status is 0, checkout status is 0 or 1 and cleaning status is 0 or 1, inputs are valid
									pool.getConnection((err, conn)=>{
										if (err) throw err;
										//Insert an availability status for table from req.body.tableId
										var sql = "INSERT INTO `tableavailability`(`tableId`, `tableAvailabilityStatus`, `tableCheckoutStatus`, `tableCleaningStatus`,`clusterId`) VALUES ("+ req.body.tableId +","+ req.body.tableAvailabilityStatus +","+ req.body.tableCheckoutStatus +","+ req.body.tableCleaningStatus+ "," + clusternumber + ")";
										//console.log(sql);
										conn.query(sql, (err)=>{
											conn.release();
											if (err) throw err;
										});
									});
									tablemessage="Define table Status";
									if(req.body.tableCheckoutStatus==1)
									{
										//GO to the checkout procedure
										res.redirect("/checkout");
									}
									else
									{
										if (type==1)
										{
											res.redirect("/tableavailable");
										}
										else
										{
											if (type==2)
											{
												res.redirect("/tableavailablelayout");
											}
											else
											{
												if (type==3)
												{
												res.redirect("/tableavailableform");
												}
												else
												{
													if (type==4)
													{
													res.redirect("/tableavailableformlayout");
													}
												}
											}
										}
									}									
								}
							}
						}
						else
						{
							tablemessage	= "ERROR: Invalid checkout status. In the checkout Status, please, type 1 if the table is in checkout and 0, if not";
							if (type==1)
							{
								res.redirect("/tableavailable");
							}
							else
							{
								if (type==2)
								{
									res.redirect("/tableavailablelayout");
								}
								else
								{
									if (type==3)
									{
									res.redirect("/tableavailableform");
									}
									else
									{
										if (type==4)
										{
										res.redirect("/tableavailableformlayout");
										}
									}
								}
							}
						}
					}
				}
				else
				{
					tablemessage= "ERROR: Invalid availability status. In the table availability Status, please, type 1 if the tale is available and 0, if not";
					if (type==1)
					{
						res.redirect("/tableavailable");
					}
					else
					{
						if (type==2)
						{
							res.redirect("/tableavailablelayout");
						}
						else
						{
							if (type==3)
							{
							res.redirect("/tableavailableform");
							}
							else
							{
								if (type==4)
								{
								res.redirect("/tableavailableformlayout");
								}
							}
						}
					}
				}
			}
		}
	}
});

//Add in the waitlist or reservation Ids the NOSHOW status and set the checkouttime to the current timestamp
	app.get("/Noshow", (req, res)=>{
	
	
	//Verify if the table was associated to any reservation Id or waitlist Id
	if(ResId.length<=0)
	{
		if(WaitId.length<=0)
		{
			console.log("It was not possible to find Waitlist or Reservation Id associated to that table!!!!!!");
		}
		else
		{
			//Table was ONLY associated to waitlist
			if (!WaitId[0].checkoutDateTime)
			{
				pool.getConnection((err, conn)=>{
				if (err) throw err;
				//Update the waitlist status to NOSHOW
				var sql = "UPDATE `waitlistentries` SET `waitlistStatus`='noshow',`checkoutDateTime`=current_timestamp() WHERE `waitlistId`= " + WaitId[0].waitlistId;
				//console.log(sql);
				conn.query(sql, (err)=>{
					conn.release();
					if (err) throw err;
					});
				});
			}
		}
	}
	else
	{
		if(WaitId.length<=0)
		{
			//Table was ONLY associated to reservation
			if (!ResId[0].checkoutDateTime)
			{
				pool.getConnection((err, conn)=>{
					if (err) throw err;
					//Update the reservation status to NOSHOW
					var sql = "UPDATE `reservationentries` SET `reservationStatus`='noshow',`checkoutDateTime`=current_timestamp() WHERE `reservationId`= " + ResId[0].reservationId;
					//console.log(sql);
					conn.query(sql, (err)=>{
						conn.release();
						if (err) throw err;
					});
				});
			}
		}
		else
		{
			//Table was associated to at least one Id in reservation and on Id in waitlist
			//Calculate difference between waitlist and reservation
			var diff = new Date(ResId[0].seatingDateTime.replace(/-/g,'/')) - new Date(WaitId[0].seatingDateTime.replace(/-/g,'/'));
			//console.log(diff);
			if (diff<0)
			{
				//The waitlist entry is the most recent event
				if (!WaitId[0].checkoutDateTime)
				{
					pool.getConnection((err, conn)=>{
						if (err) throw err;
						//Update the waitlist status to NOSHOW
						var sql = "UPDATE `waitlistentries` SET `waitlistStatus`='noshow',`checkoutDateTime`=current_timestamp() WHERE `waitlistId`= " + WaitId[0].waitlistId;
						//console.log(sql);
						conn.query(sql, (err)=>{
							conn.release();
							if (err) throw err;
						});
					});
				}
			}
			else
			{
				//The reservation entry is the most recent event
				if (!ResId[0].checkoutDateTime)
				{	
					pool.getConnection((err, conn)=>{
					if (err) throw err;
					//Update the reservation status to NOSHOW
					var sql = "UPDATE `reservationentries` SET `reservationStatus`='noshow',`checkoutDateTime`=current_timestamp() WHERE `reservationId`= " + ResId[0].reservationId;
					//console.log(sql);
					conn.query(sql, (err)=>{
						conn.release();
						if (err) throw err;
						});
					});
				}
			}
		}
	}
	
	if (type==1)
	{
		res.redirect("/tableavailable");
	}
	else
	{
		if (type==2)
		{
			res.redirect("/tableavailablelayout");
		}
		else
		{
			if (type==3)
			{
			res.redirect("/tableavailableform");
			}
			else
			{
				if (type==4)
				{
				res.redirect("/tableavailableformlayout");
				}
			}
		}
	}
});




app.get("/checkout", (req, res)=>{

	//Verify if the table was associated to any reservation Id or waitlist Id

	if(ResId.length<=0)
	{
		if(WaitId.length<=0)
		{
			console.log("It was not possible to find Waitlist or Reservation Id associated to that table!!!!!!");
		}
		else
		{
			//Table was ONLY associated to waitlist
			if (!WaitId[0].checkoutDateTime)
			{
				pool.getConnection((err, conn)=>{
					if (err) throw err;
					//Update the waitlist checkoutDateTime to current timestamp
					var sql = "UPDATE `waitlistentries` SET `checkoutDateTime`=current_timestamp() WHERE `waitlistId`= " + WaitId[0].waitlistId;
					//console.log(sql);
					conn.query(sql, (err)=>{
						conn.release();
						if (err) throw err;
					});
				});
			}	
		}
	}
	else
	{
		if(WaitId.length<=0)
		{
			//Table was ONLY associated to reservation
			if (!ResId[0].checkoutDateTime)
			{
				pool.getConnection((err, conn)=>{
					if (err) throw err;
					//Update the reservation checkoutDateTime to current timestamp
					var sql = "UPDATE `reservationentries` SET `checkoutDateTime`=current_timestamp() WHERE `reservationId`= " + ResId[0].reservationId;
					//console.log(sql);
					conn.query(sql, (err)=>{
						conn.release();
						if (err) throw err;
					});
				});
			}
		}
		else
		{
			//Table was associated to at least one Id in reservation and on Id in waitlist
			//Calculate difference between waitlist and reservation
			var diff = new Date(ResId[0].seatingDateTime.replace(/-/g,'/')) - new Date(WaitId[0].seatingDateTime.replace(/-/g,'/'));
			//console.log(diff);
			if (diff<0)
			{
				//The waitlist entry is the most recent event and no checkoutDateTime was included before
				if (!WaitId[0].checkoutDateTime)
				{
					pool.getConnection((err, conn)=>{
						if (err) throw err;
						//Update the waitlist checkoutDateTime to current timestamp
						var sql = "UPDATE `waitlistentries` SET `checkoutDateTime`=current_timestamp() WHERE `waitlistId`= " + WaitId[0].waitlistId;
						//console.log(sql);
						conn.query(sql, (err)=>{
							conn.release();
							if (err) throw err;
						});
					});
				}
			}
			else
			{
				//The reservation entry is the most recent event and no checkoutDateTime was included before
				if (!ResId[0].checkoutDateTime)
				{	
					pool.getConnection((err, conn)=>{
					if (err) throw err;
					//Update the reservation checkoutDateTime to current timestamp
					var sql = "UPDATE `reservationentries` SET `checkoutDateTime`=current_timestamp() WHERE `reservationId`= " + ResId[0].reservationId;
					//console.log(sql);
					conn.query(sql, (err)=>{
						conn.release();
						if (err) throw err;
						});
					});
				}
			}
		}	
	}
	if (type==1)
	{
		res.redirect("/tableavailable");
	}
	else
	{
		if (type==2)
		{
			res.redirect("/tableavailablelayout");
		}
		else
		{
			if (type==3)
			{
			res.redirect("/tableavailableform");
			}
			else
			{
				if (type==4)
				{
				res.redirect("/tableavailableformlayout");
				}
			}
		}
	}
});






/*Presents the parameters for the table seating*/
app.get("/tableseating", (req, res)=>{
	type=5;
	// Query brings the tables status of the active restaurant layout
	X=[];
	pool.getConnection((err, conn)=>{
		if (err) throw err;
		var sql = "SELECT DISTINCT TEMP2.TABLEID, TEMP2.TABLEAVAILABILITYSTATUS, TEMP2.tableCheckoutStatus, TEMP2.tableCleaningStatus, TEMP2.`clusterId` from `restaurants` AS RT JOIN `layoutclusters` as TA ON TA.`layoutId`=RT.`layoutActive` JOIN  `clustertables` as TB on TA.`clusterId`=TB.`clusterId` join ( SELECT TA.* FROM `tableavailability`as  TA JOIN( SELECT `tableId`, max(`dateTime`) AS dateTime FROM `tableavailability` Group by  `tableId`) AS temp ON (TA.tableId=temp.tableId) AND (TA.dateTime = temp.dateTime)) as temp2 on temp2.tableId = tb.tableId WHERE RT.`restaurantId`=1";
		conn.query(sql, (err, tableavailable, fields)=>{
			conn.release();
			if (err) throw err;
			X=tableavailable;
		});
	});

	//Query brings the waitlist position
	Y=[];
	pool.getConnection((err, conn)=>{
	if (err) throw err;
	var sql = "SELECT  `waitlistId`, `customerId`, `waitlistPartySize`, `checkinDateTime`, TIMEDIFF(current_timestamp(),`checkinDateTime`) AS waitimeH, ROUND (TIME_TO_SEC ( TIMEDIFF(current_timestamp(),`checkinDateTime`))/60,0) AS waitimemin FROM  `restaurants` as RT JOIN `waitlistentries` as WE on RT.`RestaurantId`=WE.`restaurantId` WHERE date(`checkinDateTime`)=date(current_timestamp()) and `waitlistStatus`='active' and RT.`restaurantId`=1 order by TIMEDIFF(current_timestamp(),`checkinDateTime`) DESC";
	conn.query(sql, (err, waitlist, fields)=>{
	conn.release();
			if (err) throw err;
			Y=waitlist;
		});
	});
		//Query brings the reservation list ordered by reservation time and waiting time
		Z=[];
	pool.getConnection((err, conn)=>{
	if (err) throw err;
	var sql = "SELECT `reservationId`,`customerId`, `reservationPartySize`, `reservationDateTime`, ROUND(TIMEDIFF(current_timestamp(),`reservationDateTime`)/60,0) as restimemin, ROUND(TIME_TO_SEC ( TIMEDIFF(current_timestamp(),`checkinDateTime`))/60,0) as waitimemin  FROM `restaurants` as RT JOIN `reservationentries` as RE on RT.`restaurantId`=RE.`restaurantId` WHERE date(`reservationDateTime`)=date(current_timestamp()) and `reservationStatus`='confirmed' and RT.`restaurantId`=1 order by TIMEDIFF(`reservationDateTime`,current_timestamp()),TIMEDIFF(`checkinDateTime`,current_timestamp()) ASC";
	conn.query(sql, (err, reservationlist, fields)=>{
	conn.release();
			if (err) throw err;
			Z=reservationlist;
		});
	});
	
	//Query brings the cluster available in priority
	ClusP=[];
	pool.getConnection((err, conn)=>{
	if (err) throw err;
	var sql = "select distinct ct.clusterId, lc.clusterName, lc.clusterPriority, Sum(ct.tableLayoutSeatNumber) AS totalSeats from `restaurants` AS RT JOIN `layouts` AS LY ON RT.`RestaurantId`=LY.`RestaurantId` JOIN `layoutclusters` AS LC ON LY.`layoutId`=LC.`layoutId` JOIN clustertables as CT on CT.clusterId=LC.clusterId where RT.`RestaurantId`=1 and CT.clusterId not in ( select clusterId from clustertables where tableId not in ( SELECT TA.`tableId` FROM `tableavailability`as  TA JOIN( SELECT `tableId`, max(`dateTime`) AS dateTime FROM `tableavailability` Group by  `tableId`) AS temp ON (TA.tableId=temp.tableId) AND (TA.dateTime = temp.dateTime) WHERE TA.`tableAvailabilityStatus`=1)) group by clusterId,  `clusterPriority` order by  `clusterPriority` asc";
	conn.query(sql, (err, clusterpriority, fields)=>{
	conn.release();
			if (err) throw err;
			ClusP=clusterpriority;
			res.render("tableseating",{ nos: X, nus: Y, nys :Z, nws:ClusP, mens:"Table Seating Module"});
		});
	});
	
});

/*Presents the parameters for the table seating*/
app.get("/tableseatinglayout", (req, res)=>{
	type=6;
	// Query brings the tables status of the active restaurant layout
	X=[];
	pool.getConnection((err, conn)=>{
		if (err) throw err;
		var sql = "SELECT DISTINCT TEMP2.TABLEID, TEMP2.TABLEAVAILABILITYSTATUS, TEMP2.tableCheckoutStatus, TEMP2.tableCleaningStatus, TEMP2.`clusterId` from `restaurants` AS RT JOIN `layoutclusters` as TA ON TA.`layoutId`=RT.`layoutActive` JOIN  `clustertables` as TB on TA.`clusterId`=TB.`clusterId` join ( SELECT TA.* FROM `tableavailability`as  TA JOIN( SELECT `tableId`, max(`dateTime`) AS dateTime FROM `tableavailability` Group by  `tableId`) AS temp ON (TA.tableId=temp.tableId) AND (TA.dateTime = temp.dateTime)) as temp2 on temp2.tableId = tb.tableId WHERE RT.`restaurantId`=1";
		conn.query(sql, (err, tableavailable, fields)=>{
			conn.release();
			if (err) throw err;
			X=tableavailable;
		});
	});

	//Query brings the waitlist position
	Y=[];
	pool.getConnection((err, conn)=>{
	if (err) throw err;
	var sql = "SELECT  `waitlistId`, `customerId`, `waitlistPartySize`, `checkinDateTime`, TIMEDIFF(current_timestamp(),`checkinDateTime`) AS waitimeH, ROUND (TIME_TO_SEC ( TIMEDIFF(current_timestamp(),`checkinDateTime`))/60,0) AS waitimemin FROM  `restaurants` as RT JOIN `waitlistentries` as WE on RT.`RestaurantId`=WE.`restaurantId` WHERE date(`checkinDateTime`)=date(current_timestamp()) and `waitlistStatus`='active' and RT.`restaurantId`=1 order by TIMEDIFF(current_timestamp(),`checkinDateTime`) DESC";
	conn.query(sql, (err, waitlist, fields)=>{
	conn.release();
			if (err) throw err;
			Y=waitlist;
		});
	});
		//Query brings the reservation list ordered by reservation time and waiting time
		Z=[];
	pool.getConnection((err, conn)=>{
	if (err) throw err;
	var sql = "SELECT `reservationId`,`customerId`, `reservationPartySize`, `reservationDateTime`, ROUND(TIMEDIFF(current_timestamp(),`reservationDateTime`)/60,0) as restimemin, ROUND(TIME_TO_SEC ( TIMEDIFF(current_timestamp(),`checkinDateTime`))/60,0) as waitimemin  FROM `restaurants` as RT JOIN `reservationentries` as RE on RT.`restaurantId`=RE.`restaurantId` WHERE date(`reservationDateTime`)=date(current_timestamp()) and `reservationStatus`='confirmed' and RT.`restaurantId`=1 order by TIMEDIFF(`reservationDateTime`,current_timestamp()),TIMEDIFF(`checkinDateTime`,current_timestamp()) ASC";
	conn.query(sql, (err, reservationlist, fields)=>{
	conn.release();
			if (err) throw err;
			Z=reservationlist;
		});
	});
	
	//Query brings the cluster available in priority
	ClusP=[];
	pool.getConnection((err, conn)=>{
	if (err) throw err;
	var sql = "select distinct ct.clusterId, lc.clusterName, lc.clusterPriority, Sum(ct.tableLayoutSeatNumber) AS totalSeats from `restaurants` AS RT JOIN `layouts` AS LY ON RT.`RestaurantId`=LY.`RestaurantId` JOIN `layoutclusters` AS LC ON LY.`layoutId`=LC.`layoutId` JOIN clustertables as CT on CT.clusterId=LC.clusterId where RT.`RestaurantId`=1 and CT.clusterId not in ( select clusterId from clustertables where tableId not in ( SELECT TA.`tableId` FROM `tableavailability`as  TA JOIN( SELECT `tableId`, max(`dateTime`) AS dateTime FROM `tableavailability` Group by  `tableId`) AS temp ON (TA.tableId=temp.tableId) AND (TA.dateTime = temp.dateTime) WHERE TA.`tableAvailabilityStatus`=1)) group by clusterId,  `clusterPriority` order by  `clusterPriority` asc";
	conn.query(sql, (err, clusterpriority, fields)=>{
	conn.release();
			if (err) throw err;
			ClusP=clusterpriority;
			//res.render("table_seating",{ nos: X, nus: Y, nys :Z, nws:ClusP, mens:"Table Seating Module"});
		});
	});
	
	tableStatus=[];
	pool.getConnection((err, conn)=>{
		if (err) throw err;
		var sql = "SELECT DISTINCT TEMP2.TABLEID, TEMP2.TABLEAVAILABILITYSTATUS, TEMP2.tableCheckoutStatus, TEMP2.tableCleaningStatus,TEMP2.`clusterId` from `restaurants` AS RT JOIN `layoutclusters` as TA ON TA.`layoutId`=RT.`layoutActive` JOIN  `clustertables` as TB on TA.`clusterId`=TB.`clusterId` join ( SELECT TA.* FROM `tableavailability`as  TA JOIN( SELECT `tableId`, max(`dateTime`) AS dateTime FROM `tableavailability` Group by  `tableId`) AS temp ON (TA.tableId=temp.tableId) AND (TA.dateTime = temp.dateTime)) as temp2 on temp2.tableId = tb.tableId WHERE RT.`restaurantId`=1";
		conn.query(sql, (err, result, fields)=>{
			conn.release();
			if (err) throw err;
			tableStatus=result;
		});
	});
	res.redirect("/restaurantlayout");
});


/*Form to define table to party*/
app.get("/tableseatingform", (req, res)=>{

	type=7;
	X=[];
	// Query brings the tables status of the active restaurant layout
	pool.getConnection((err, conn)=>{
		if (err) throw err;
		var sql = "SELECT DISTINCT TEMP2.TABLEID, TEMP2.TABLEAVAILABILITYSTATUS, TEMP2.tableCheckoutStatus, TEMP2.tableCleaningStatus, TEMP2.`clusterId` from `restaurants` AS RT JOIN `layoutclusters` as TA ON TA.`layoutId`=RT.`layoutActive` JOIN  `clustertables` as TB on TA.`clusterId`=TB.`clusterId` join ( SELECT TA.* FROM `tableavailability`as  TA JOIN( SELECT `tableId`, max(`dateTime`) AS dateTime FROM `tableavailability` Group by  `tableId`) AS temp ON (TA.tableId=temp.tableId) AND (TA.dateTime = temp.dateTime)) as temp2 on temp2.tableId = tb.tableId WHERE RT.`restaurantId`=1";
		conn.query(sql, (err, tableavailable, fields)=>{
			conn.release();
			if (err) throw err;
			X=tableavailable;
		});
	});

	//Query brings the waitlist position
	Y=[];
	pool.getConnection((err, conn)=>{
	if (err) throw err;
	var sql = "SELECT  `waitlistId`, `customerId`, `waitlistPartySize`, `checkinDateTime`, TIMEDIFF(current_timestamp(),`checkinDateTime`) AS waitimeH, ROUND(TIME_TO_SEC ( TIMEDIFF(current_timestamp(),`checkinDateTime`))/60,0) AS waitimemin FROM  `restaurants` as RT JOIN `waitlistentries` as WE on RT.`RestaurantId`=WE.`restaurantId` WHERE date(`checkinDateTime`)=date(current_timestamp()) and `waitlistStatus`='active' and RT.`restaurantId`=1 order by TIMEDIFF(current_timestamp(),`checkinDateTime`) DESC";
	conn.query(sql, (err, waitlist, fields)=>{
	conn.release();
			if (err) throw err;
			Y=waitlist;
		});
	});
		//Query brings the reservation list ordered by reservation time and waiting time
	Z=[];
	pool.getConnection((err, conn)=>{
	if (err) throw err;
	var sql = "SELECT `reservationId`,`customerId`, `reservationPartySize`, `reservationDateTime`, ROUND(TIMEDIFF(current_timestamp(),`reservationDateTime`)/60,0) as restimemin, ROUND(TIME_TO_SEC ( TIMEDIFF(current_timestamp(),`checkinDateTime`))/60,0) as waitimemin  FROM `restaurants` as RT JOIN `reservationentries` as RE on RT.`restaurantId`=RE.`restaurantId` WHERE date(`reservationDateTime`)=date(current_timestamp()) and `reservationStatus`='confirmed' and RT.`restaurantId`=1 order by TIMEDIFF(`reservationDateTime`,current_timestamp()),TIMEDIFF(`checkinDateTime`,current_timestamp()) ASC";
	conn.query(sql, (err, reservationlist, fields)=>{
	conn.release();
			if (err) throw err;
			Z=reservationlist;
		});
	});
	
	//Query brings the cluster available in priority
	ClusP=[];
	pool.getConnection((err, conn)=>{
	if (err) throw err;
	var sql = "select distinct ct.clusterId, lc.clusterName, lc.clusterPriority, Sum(ct.tableLayoutSeatNumber) AS totalSeats from `restaurants` AS RT JOIN `layouts` AS LY ON RT.`RestaurantId`=LY.`RestaurantId` JOIN `layoutclusters` AS LC ON LY.`layoutId`=LC.`layoutId` JOIN clustertables as CT on CT.clusterId=LC.clusterId where RT.`RestaurantId`=1 and CT.clusterId not in ( select clusterId from clustertables where tableId not in ( SELECT TA.`tableId` FROM `tableavailability`as  TA JOIN( SELECT `tableId`, max(`dateTime`) AS dateTime FROM `tableavailability` Group by  `tableId`) AS temp ON (TA.tableId=temp.tableId) AND (TA.dateTime = temp.dateTime) WHERE TA.`tableAvailabilityStatus`=1)) group by clusterId,  `clusterPriority` order by  `clusterPriority` asc";
	conn.query(sql, (err, clusterpriority, fields)=>{
	conn.release();
			if (err) throw err;
			ClusP=clusterpriority;
			res.render("tableseatingform",{ nos: X, nus: Y, nys :Z, nws:ClusP, mens:message});
		});
	});
});


/*Post that receives the user input and change the database*/
app.post("/tableseatingentry",(req, res)=>{
	pass=[];
	pass=req.body;
	// Data entry Validation
	if (!req.body.clusterId)
	{
		message= "ERROR: Invalid table/cluster Id. Choose a cluster or table available";
		if (type==5)
		{
			res.redirect("/tableseating");
		}
		else
		{
			if (type==6)
			{
				res.redirect("/tableseatinglayout");
			}
			else
			{
				if (type==7)
				{
				res.redirect("/tableseatingform");
				}
				else
				{
					if (type==8)
					{
					res.redirect("/tableseatingformlayout");
					}
				}
			}
		}
	}
	else
	{
		if(!req.body.reservationId)
		{
			if( !req.body.waitlistId)
			{
				message= "ERROR: Entry a valid reservation or waitlist Id";
				if (type==5)
				{
					res.redirect("/tableseating");
				}
				else
				{
					if (type==6)
					{
						res.redirect("/tableseatinglayout");
					}
					else
					{
						if (type==7)
						{
						res.redirect("/tableseatingform");
						}
						else
						{
							if (type==8)
							{
							res.redirect("/tableseatingformlayout");
							}
						}
					}
				}
			}
			else
			{
				//UPDATE the waitlist status to SEATED, SeatingDateTIme to current timestamp
				pool.getConnection((err, conn)=>{
					if (err) throw err;
					var sql = "UPDATE `waitlistentries` SET `waitlistStatus`='seated',`seatingDateTime`=current_timestamp() WHERE `waitlistId`=" + req.body.waitlistId;
					conn.query(sql, (err)=>{
						conn.release();
						if (err) throw err;
					});
				});
				message="Choose the table/cluter and reservation/ wailist entry"; 
				//Query to get all the tables from a cluster
				pool.getConnection((err, conn)=>{
					if (err) throw err;
					var sql =  "SELECT `tableId` FROM `clustertables` WHERE `clusterId` = " + req.body.clusterId;
						conn.query(sql, (err, tables, fields)=>{
						conn.release();
						if (err) throw err;
						w=tables;
					});
				});
				res.redirect("/tableunavailable");
			}
		}
		else
		{
			if( !req.body.waitlistId)
			{
				//UPDATE the reservation status to SEATED, SeatingDateTIme to current timestamp
				pool.getConnection((err, conn)=>{
					if (err) throw err;
					var sql = "UPDATE `reservationentries` SET `reservationStatus`='seated',`seatingDateTime`=current_timestamp() WHERE `reservationId`=" + req.body.reservationId;
					conn.query(sql, (err)=>{
						conn.release();
						if (err) throw err;
					});
				});
				message="Set table/cluster to reservation/wailist Entry"; 
				//Query to get all the tables from a cluster
				pool.getConnection((err, conn)=>{
					if (err) throw err;
					var sql =  "SELECT `tableId` FROM `clustertables` WHERE `clusterId` = " + req.body.clusterId;
					conn.query(sql, (err, tables, fields)=>{
						conn.release();
						if (err) throw err;
						w=tables;
					});
				});
				res.redirect("/tableunavailable");
			}
			else
			{
				message="ERROR: You cannot set the same table for a reservation/ wailist entry at the same time.";
				if (type==5)
				{
					res.redirect("/tableseating");
				}
				else
				{
					if (type==6)
					{
						res.redirect("/tableseatinglayout");
					}
					else
					{
						if (type==7)
						{
						res.redirect("/tableseatingform");
						}
						else
						{
							if (type==8)
							{
							res.redirect("/tableseatingformlayout");
							}
						}
					}
				}
			}
		}	
	}
});

/*Update the database, insert the new table status and insert the table in the reservation or waitlist*/
app.get("/tableunavailable", (req, res)=>{


	var sql
	var sql1;
	var k;
	var count = Object.keys(w).length;

	//INSERT the table status to unavailable in the tableavailability
	sql =  "INSERT INTO `tableavailability`(`tableId`, `tableAvailabilityStatus`, `tableCheckoutStatus`, `tableCleaningStatus`, `clusterId`) VALUES ("+ w[0].tableId +",0,0,0,"+ pass.clusterId +");";
	
	if(!pass.reservationId)
	{
		//INSERT the table in waitlist entry
		sql1 = "INSERT INTO `waitlistentrytables`(`waitlistId`, `tableId`) VALUES (" + pass.waitlistId + ","+ w[0].tableId + ");";
	}
	else
	{
		//INSERT the table in reservation entry
		sql1 = "INSERT INTO `reservationentrytables`(`reservationId`, `tableId`) VALUES (" + pass.reservationId + ","+ w[0].tableId + ");";
	}
	
	pool.getConnection((err, conn)=>{
		if (err) throw err;
		conn.query(sql,  (err)=>{
			if (err) throw err;
			conn.release();
		});
	});
	
	pool.getConnection((err, conn)=>{
		if (err) throw err;
		conn.query(sql1,  (err)=>{
			if (err) throw err;
			conn.release();
		});
	});
	
	
	

	k=[];
	if (count != 1)
	{
		for (i=1; i < count; i++)
		{
			k[i-1]=w[i];
		}
		w=[];
		w=k;
		for (i=0; i<5000; i++)
		{
			//console.log(i);
		}
		res.redirect("/tableunavailable");
	}
	else
	{
		for (i=0; i<5000; i++)
		{
		//console.log(i);
		}
		if (type==5)
		{
			res.redirect("/tableseating");
		}
		else
		{
			if (type==6)
			{
				res.redirect("/tableseatinglayout");
			}
			else
			{
				if (type==7)
				{
				res.redirect("/tableseatingform");
				}
				else
				{
					if (type==8)
					{
					res.redirect("/tableseatingformlayout");
					}
				}
			}
		}
	}
	
});

/*Form to define table to party*/
app.get("/tableseatingformlayout", (req, res)=>{
	type=8;
	// Query brings the tables status of the active restaurant layout
	X=[];
	pool.getConnection((err, conn)=>{
		if (err) throw err;
		var sql = "SELECT DISTINCT TEMP2.TABLEID, TEMP2.TABLEAVAILABILITYSTATUS, TEMP2.tableCheckoutStatus, TEMP2.tableCleaningStatus, TEMP2.`clusterId` from `restaurants` AS RT JOIN `layoutclusters` as TA ON TA.`layoutId`=RT.`layoutActive` JOIN  `clustertables` as TB on TA.`clusterId`=TB.`clusterId` join ( SELECT TA.* FROM `tableavailability`as  TA JOIN( SELECT `tableId`, max(`dateTime`) AS dateTime FROM `tableavailability` Group by  `tableId`) AS temp ON (TA.tableId=temp.tableId) AND (TA.dateTime = temp.dateTime)) as temp2 on temp2.tableId = tb.tableId WHERE RT.`restaurantId`=1";
		conn.query(sql, (err, tableavailable, fields)=>{
			conn.release();
			if (err) throw err;
			X=tableavailable;
		});
	});

	//Query brings the waitlist position
	Y=[];
	pool.getConnection((err, conn)=>{
	if (err) throw err;
	var sql = "SELECT  `waitlistId`, `customerId`, `waitlistPartySize`, `checkinDateTime`, TIMEDIFF(current_timestamp(),`checkinDateTime`) AS waitimeH, ROUND(TIME_TO_SEC ( TIMEDIFF(current_timestamp(),`checkinDateTime`))/60,0) AS waitimemin FROM  `restaurants` as RT JOIN `waitlistentries` as WE on RT.`RestaurantId`=WE.`restaurantId` WHERE date(`checkinDateTime`)=date(current_timestamp()) and `waitlistStatus`='active' and RT.`restaurantId`=1 order by TIMEDIFF(current_timestamp(),`checkinDateTime`) DESC";
	conn.query(sql, (err, waitlist, fields)=>{
	conn.release();
			if (err) throw err;
			Y=waitlist;
		});
	});
		//Query brings the reservation list ordered by reservation time and waiting time
	Z=[];
	pool.getConnection((err, conn)=>{
	if (err) throw err;
	var sql = "SELECT `reservationId`,`customerId`, `reservationPartySize`, `reservationDateTime`, ROUND(TIMEDIFF(current_timestamp(),`reservationDateTime`)/60,0) as restimemin, ROUND(TIME_TO_SEC ( TIMEDIFF(current_timestamp(),`checkinDateTime`))/60,0) as waitimemin  FROM `restaurants` as RT JOIN `reservationentries` as RE on RT.`restaurantId`=RE.`restaurantId` WHERE date(`reservationDateTime`)=date(current_timestamp()) and `reservationStatus`='confirmed' and RT.`restaurantId`=1 order by TIMEDIFF(`reservationDateTime`,current_timestamp()),TIMEDIFF(`checkinDateTime`,current_timestamp()) ASC";
	conn.query(sql, (err, reservationlist, fields)=>{
	conn.release();
			if (err) throw err;
			Z=reservationlist;
		});
	});
	

	//Query brings the cluster available in priority
	ClusP=[];
	pool.getConnection((err, conn)=>{
	if (err) throw err;
	var sql = "select distinct ct.clusterId, lc.clusterName, lc.clusterPriority, Sum(ct.tableLayoutSeatNumber) AS totalSeats from `restaurants` AS RT JOIN `layouts` AS LY ON RT.`RestaurantId`=LY.`RestaurantId` JOIN `layoutclusters` AS LC ON LY.`layoutId`=LC.`layoutId` JOIN clustertables as CT on CT.clusterId=LC.clusterId where RT.`RestaurantId`=1 and CT.clusterId not in ( select clusterId from clustertables where tableId not in ( SELECT TA.`tableId` FROM `tableavailability`as  TA JOIN( SELECT `tableId`, max(`dateTime`) AS dateTime FROM `tableavailability` Group by  `tableId`) AS temp ON (TA.tableId=temp.tableId) AND (TA.dateTime = temp.dateTime) WHERE TA.`tableAvailabilityStatus`=1)) group by clusterId,  `clusterPriority` order by  `clusterPriority` asc";
	conn.query(sql, (err, clusterpriority, fields)=>{
	conn.release();
			if (err) throw err;
			ClusP=clusterpriority;
		});
	});
	// Query brings the tables status of the active restaurant layout
	tableStatus=[];
	pool.getConnection((err, conn)=>{
		if (err) throw err;
		const query = util.promisify(conn.query).bind(conn);
		var sql = "SELECT DISTINCT TEMP2.TABLEID, TEMP2.TABLEAVAILABILITYSTATUS, TEMP2.tableCheckoutStatus, TEMP2.tableCleaningStatus, TEMP2.clusterID from `restaurants` AS RT JOIN `layoutclusters` as TA ON TA.`layoutId`=RT.`layoutActive` JOIN  `clustertables` as TB on TA.`clusterId`=TB.`clusterId` join ( SELECT TA.* FROM `tableavailability`as  TA JOIN( SELECT `tableId`, max(`dateTime`) AS dateTime FROM `tableavailability` Group by  `tableId`) AS temp ON (TA.tableId=temp.tableId) AND (TA.dateTime = temp.dateTime)) as temp2 on temp2.tableId = tb.tableId WHERE RT.`restaurantId`=1";
		(async () => {
			try {
					const result = await query(sql);
					tableStatus=result;
					
				}catch(e){
					throw e;
				} finally {
					conn.release();
				}
		})()
	});
	
	res.redirect("/restaurantlayout");

});


//Error PAGE
app.use((req,res,next) =>{
	res.status(404).render("404");
});