let timetables =  {

    calendar : {
        'a' : [{from: 19730603, to: 19740525}],
        'b' : [{from: 19730603, to: 19740525},{x:5},{x:6},{x:7},{on:19731223},{on:19731230}],
        'c' : [{from: 19730603, to: 19740525}],
        'd' : [{from: 19730603, to: 19740525}],
        'e' : [{from: 19730603, to: 19740525}]
    },

    lines: [
        {nr:'9639',calendar: 'a',sched:[
            {from:'RDBNY',to:'ORMPA',timeFrom:534,timeTo:543},
            {from:'ORMPA',to:'DSHRV',timeFrom:543,timeTo:548},
            {from:'DSHRV',to:'SZKMU',timeFrom:548,timeTo:555},
            {from:'SZKMU',to:'KZBA',timeFrom:555,timeTo:602}
            ]},
        {nr:'9632',calendar: 'a',sched:[
                {from:'KZBA',to:'SZKMU',timeFrom:634,timeTo:642},
                {from:'SZKMU',to:'DSHRV',timeFrom:642,timeTo:648},
                {from:'DSHRV',to:'ORMPA',timeFrom:648,timeTo:654},
                {from:'ORMPA',to:'RDBNY',timeFrom:654,timeTo:702}
            ]},
        {nr:'9627',calendar: 'a',sched:[
                {from:'RDBNY',to:'ORMPA',timeFrom:712,timeTo:721},
                {from:'ORMPA',to:'DSHRV',timeFrom:721,timeTo:726},
                {from:'DSHRV',to:'SZKMU',timeFrom:726,timeTo:733},
                {from:'SZKMU',to:'KZBA',timeFrom:733,timeTo:740}
            ]},
        {nr:'9622',calendar: 'a',sched:[
                {from:'KZBA',to:'SZKMU',timeFrom:900,timeTo:908},
                {from:'SZKMU',to:'DSHRV',timeFrom:908,timeTo:914},
                {from:'DSHRV',to:'ORMPA',timeFrom:914,timeTo:920},
                {from:'ORMPA',to:'RDBNY',timeFrom:920,timeTo:928}
            ]},
        {nr:'9637',calendar: 'a',sched:[
                {from:'RDBNY',to:'ORMPA',timeFrom:1107,timeTo:1116},
                {from:'ORMPA',to:'DSHRV',timeFrom:1116,timeTo:1121},
                {from:'DSHRV',to:'SZKMU',timeFrom:1121,timeTo:1127},
                {from:'SZKMU',to:'KZBA',timeFrom:1127,timeTo:1134}
            ]},
        {nr:'9634a',calendar: 'b',sched:[
                {from:'KZBA',to:'SZKMU',timeFrom:1152,timeTo:1200},
                {from:'SZKMU',to:'DSHRV',timeFrom:1200,timeTo:1206},
                {from:'DSHRV',to:'ORMPA',timeFrom:1206,timeTo:1212},
                {from:'ORMPA',to:'RDBNY',timeFrom:1212,timeTo:1220}
            ]},
        {nr:'9634',calendar: 'c',sched:[
                {from:'KZBA',to:'SZKMU',timeFrom:1228,timeTo:1236},
                {from:'SZKMU',to:'DSHRV',timeFrom:1236,timeTo:1242},
                {from:'DSHRV',to:'ORMPA',timeFrom:1242,timeTo:1248},
                {from:'ORMPA',to:'RDBNY',timeFrom:1248,timeTo:1256}
            ]},
        {nr:'9633',calendar: 'a',sched:[
                {from:'RDBNY',to:'ORMPA',timeFrom:1442,timeTo:1451},
                {from:'ORMPA',to:'DSHRV',timeFrom:1451,timeTo:1456},
                {from:'DSHRV',to:'SZKMU',timeFrom:1456,timeTo:1502},
                {from:'SZKMU',to:'KZBA',timeFrom:1502,timeTo:1509}
            ]},
        {nr:'9646',calendar: 'a',sched:[
                {from:'KZBA',to:'SZKMU',timeFrom:1536,timeTo:1545},
                {from:'SZKMU',to:'DSHRV',timeFrom:1545,timeTo:1551},
                {from:'DSHRV',to:'ORMPA',timeFrom:1551,timeTo:1557},
                {from:'ORMPA',to:'RDBNY',timeFrom:1557,timeTo:1605}
            ]},
        {nr:'9643',calendar: 'a',sched:[
                {from:'RDBNY',to:'ORMPA',timeFrom:1704,timeTo:1713},
                {from:'ORMPA',to:'DSHRV',timeFrom:1713,timeTo:1718},
                {from:'DSHRV',to:'SZKMU',timeFrom:1718,timeTo:1724},
                {from:'SZKMU',to:'KZBA',timeFrom:1724,timeTo:1731}
            ]},
        {nr:'9636',calendar: 'a',sched:[
                {from:'KZBA',to:'SZKMU',timeFrom:1752,timeTo:1800},
                {from:'SZKMU',to:'DSHRV',timeFrom:1800,timeTo:1806},
                {from:'DSHRV',to:'ORMPA',timeFrom:1806,timeTo:1812},
                {from:'ORMPA',to:'RDBNY',timeFrom:1812,timeTo:1820}
            ]},
        {nr:'9631',calendar: 'a',sched:[
                {from:'RDBNY',to:'ORMPA',timeFrom:1922,timeTo:1931},
                {from:'ORMPA',to:'DSHRV',timeFrom:1931,timeTo:1936},
                {from:'DSHRV',to:'SZKMU',timeFrom:1936,timeTo:1942},
                {from:'SZKMU',to:'KZBA',timeFrom:1942,timeTo:1949}
            ]},
        {nr:'9638',calendar: 'd',sched:[
                {from:'KZBA',to:'SZKMU',timeFrom:2018,timeTo:2026},
                {from:'SZKMU',to:'DSHRV',timeFrom:2026,timeTo:2032},
                {from:'DSHRV',to:'ORMPA',timeFrom:2032,timeTo:2038},
                {from:'ORMPA',to:'RDBNY',timeFrom:2038,timeTo:2046}
            ]},
        {nr:'9648',calendar: 'e',sched:[
                {from:'KZBA',to:'SZKMU',timeFrom:2137,timeTo:2145},
                {from:'SZKMU',to:'DSHRV',timeFrom:2145,timeTo:2151},
                {from:'DSHRV',to:'ORMPA',timeFrom:2151,timeTo:2157},
                {from:'ORMPA',to:'RDBNY',timeFrom:2157,timeTo:2205}
            ]},
        ]

}
export { timetables } ;
