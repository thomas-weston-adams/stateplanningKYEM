import type { County, PlanStatus, Region } from "@/types";

// Helper to build county plan records
function makePlans(
  status: PlanStatus,
  cempYear: number | null,
  hmpYear: number | null
): County["plans"] {
  const statusFor = (
    submittedYear: number | null,
    lifespanYears: number
  ): PlanStatus => {
    if (!submittedYear) return "not-submitted";
    const expiry = new Date(`${submittedYear + lifespanYears}-06-01`);
    const now = new Date("2026-03-23");
    const daysLeft = (expiry.getTime() - now.getTime()) / 86400000;
    if (daysLeft < 0) return "overdue";
    if (daysLeft < 90) return "due-soon";
    return "current";
  };

  return [
    {
      type: "CEMP",
      label: "Comprehensive Emergency Management Plan",
      lastSubmitted: cempYear ? `${cempYear}-03-15` : null,
      expirationDate: cempYear ? `${cempYear + 5}-03-15` : null,
      status: statusFor(cempYear, 5),
      fileId: cempYear ? `cemp-${cempYear}` : undefined,
    },
    {
      type: "HMP",
      label: "Hazard Mitigation Plan",
      lastSubmitted: hmpYear ? `${hmpYear}-07-01` : null,
      expirationDate: hmpYear ? `${hmpYear + 5}-07-01` : null,
      status: statusFor(hmpYear, 5),
      fileId: hmpYear ? `hmp-${hmpYear}` : undefined,
    },
    {
      type: "EOP",
      label: "Emergency Operations Plan (Annex)",
      lastSubmitted: cempYear ? `${cempYear}-04-01` : null,
      expirationDate: cempYear ? `${cempYear + 3}-04-01` : null,
      status: statusFor(cempYear, 3),
      fileId: cempYear ? `eop-${cempYear}` : undefined,
    },
  ];
}

function makeEmail(name: string, county: string): string {
  const [first, last] = name.split(" ");
  return `${first.toLowerCase()}.${last.toLowerCase()}@${county.toLowerCase().replace(/\s/g, "")}em.ky.gov`;
}

type RawCounty = [
  string, // fips
  string, // name
  PlanStatus, // status
  string, // director
  string, // phone
  Region, // region
  number | null, // cempYear
  number | null, // hmpYear
  string | null // lastComm
];

const RAW: RawCounty[] = [
  ["21001","Adair","current","Janet Morrison","270-384-2676","South-Central",2022,2021,"2025-11-12"],
  ["21003","Allen","due-soon","Robert Simms","270-237-3711","South-Central",2021,2020,"2025-07-22"],
  ["21005","Anderson","current","Patricia Webb","502-839-1611","Bluegrass",2023,2022,"2025-12-01"],
  ["21007","Ballard","overdue","Danny Sutherland","270-665-9476","Purchase",2018,2017,"2024-03-14"],
  ["21009","Barren","current","Kevin Strode","270-651-2215","South-Central",2022,2021,"2025-10-08"],
  ["21011","Bath","not-submitted","Thomas McCoy","606-674-2111","Northeastern KY",null,null,"2022-08-30"],
  ["21013","Bell","overdue","Sandra Hensley","606-337-6103","Southeastern KY",2018,2019,"2023-11-05"],
  ["21015","Boone","current","David Walton","859-334-2171","Northern KY",2023,2022,"2025-12-15"],
  ["21017","Bourbon","current","Lisa Carroll","859-987-2144","Bluegrass",2022,2021,"2025-09-17"],
  ["21019","Boyd","current","James Preston","606-739-5135","Northeastern KY",2023,2022,"2025-11-29"],
  ["21021","Boyle","current","Michelle Sparks","859-238-1115","Bluegrass",2023,2022,"2026-01-08"],
  ["21023","Bracken","due-soon","Harold Gibson","606-735-2128","Northern KY",2021,2020,"2025-06-14"],
  ["21025","Breathitt","overdue","Tammy Combs","606-666-5791","Eastern KY",2019,2018,"2023-07-22"],
  ["21027","Breckinridge","due-soon","Steve Burden","270-756-2256","Green River",2021,2020,"2025-05-09"],
  ["21029","Bullitt","due-soon","Charles Manning","502-543-2313","Metro Louisville",2021,2020,"2025-08-03"],
  ["21031","Butler","overdue","Wanda Sears","270-526-3207","South-Central",2019,2018,"2023-12-19"],
  ["21033","Caldwell","overdue","Henry Guess","270-365-7227","Pennyrile",2018,2019,"2024-02-07"],
  ["21035","Calloway","current","Darlene Evans","270-753-1621","Purchase",2022,2021,"2025-10-31"],
  ["21037","Campbell","current","Brian Stephens","859-292-6353","Northern KY",2023,2022,"2026-01-20"],
  ["21039","Carlisle","not-submitted","Ruth Langford","270-628-5451","Purchase",null,null,"2022-05-17"],
  ["21041","Carroll","due-soon","Gary Elmore","502-732-6030","Northern KY",2021,2020,"2025-07-11"],
  ["21043","Carter","due-soon","Vickie Collinsworth","606-474-6188","Northeastern KY",2020,2021,"2025-06-28"],
  ["21045","Casey","overdue","Donald Goode","606-787-6471","South-Central",2018,2019,"2023-09-14"],
  ["21047","Christian","current","Angela Reyes","270-887-4105","Pennyrile",2022,2021,"2025-11-04"],
  ["21049","Clark","current","Paul Caudill","859-744-6257","Bluegrass",2023,2022,"2026-02-10"],
  ["21051","Clay","overdue","Rhonda Abner","606-598-3815","Eastern KY",2019,2018,"2023-06-11"],
  ["21053","Clinton","due-soon","Bruce Dalton","606-387-5971","South-Central",2020,2021,"2025-08-19"],
  ["21055","Crittenden","overdue","Frances Stinnett","270-965-4251","Pennyrile",2018,2019,"2024-01-15"],
  ["21057","Cumberland","due-soon","Larry Correll","270-864-3444","South-Central",2021,2020,"2025-09-02"],
  ["21059","Daviess","current","Scott Barnett","270-685-8442","Green River",2023,2022,"2026-01-13"],
  ["21061","Edmonson","due-soon","Norma Whitlow","270-597-2176","South-Central",2021,2020,"2025-07-30"],
  ["21063","Elliott","overdue","Timothy Haney","606-738-5451","Northeastern KY",2018,2019,"2023-10-28"],
  ["21065","Estill","not-submitted","Rebecca Fields","606-723-5156","Eastern KY",null,null,"2022-11-03"],
  ["21067","Fayette","current","Cynthia Howard","859-425-2755","Bluegrass",2023,2022,"2026-02-28"],
  ["21069","Fleming","current","Barry Applegate","606-845-8811","Northeastern KY",2022,2021,"2025-10-22"],
  ["21071","Floyd","due-soon","Sheila Hall","606-886-2355","Eastern KY",2021,2020,"2025-06-07"],
  ["21073","Franklin","current","Kenneth Sharp","502-875-8714","Bluegrass",2023,2022,"2026-01-05"],
  ["21075","Fulton","not-submitted","Margaret Lynn","270-472-1521","Purchase",null,null,"2023-02-14"],
  ["21077","Gallatin","due-soon","Edwin Cochran","859-567-5411","Northern KY",2021,2020,"2025-08-25"],
  ["21079","Garrard","due-soon","Shirley Holt","859-792-3701","Bluegrass",2021,2020,"2025-07-16"],
  ["21081","Grant","current","Gerald Sims","859-824-3321","Northern KY",2022,2021,"2025-12-09"],
  ["21083","Graves","current","Helen Yates","270-247-1681","Purchase",2022,2021,"2025-11-18"],
  ["21085","Grayson","overdue","Ray Milby","270-259-3024","South-Central",2018,2019,"2023-08-06"],
  ["21087","Green","due-soon","Joyce Greenwell","270-932-5386","South-Central",2020,2021,"2025-06-01"],
  ["21089","Greenup","current","Douglas Wheeler","606-473-9812","Northeastern KY",2022,2021,"2025-09-30"],
  ["21091","Hancock","due-soon","Lori Riney","270-927-8137","Green River",2021,2020,"2025-08-14"],
  ["21093","Hardin","current","Christopher Nally","270-765-5133","Metro Louisville",2023,2022,"2025-12-22"],
  ["21095","Harlan","overdue","Ronda Slusher","606-573-2305","Southeastern KY",2019,2018,"2023-05-17"],
  ["21097","Harrison","current","Joseph Tackett","859-234-1416","Northern KY",2022,2021,"2025-10-14"],
  ["21099","Hart","due-soon","Evelyn Hines","270-524-2341","South-Central",2021,2020,"2025-09-08"],
  ["21101","Henderson","current","Steven Haycraft","270-831-1228","Green River",2022,2021,"2025-11-25"],
  ["21103","Henry","due-soon","Dorothy Estes","502-845-2891","Northern KY",2021,2020,"2025-07-04"],
  ["21105","Hickman","due-soon","Bobby Byrd","270-653-2131","Purchase",2021,2020,"2025-08-11"],
  ["21107","Hopkins","current","Patsy Hoard","270-821-8294","Pennyrile",2022,2021,"2025-10-03"],
  ["21109","Jackson","overdue","Glen Bowling","606-287-7943","Eastern KY",2019,2018,"2023-04-29"],
  ["21111","Jefferson","current","Mark Davis","502-574-3274","Metro Louisville",2023,2022,"2026-02-17"],
  ["21113","Jessamine","current","Shannon Price","859-885-4565","Bluegrass",2022,2021,"2025-12-06"],
  ["21115","Johnson","due-soon","Dean Music","606-789-3516","Northeastern KY",2021,2020,"2025-05-21"],
  ["21117","Kenton","current","Mary Galvin","859-392-1878","Northern KY",2023,2022,"2026-01-29"],
  ["21119","Knott","overdue","Becky Combs","606-785-5471","Eastern KY",2018,2019,"2023-12-01"],
  ["21121","Knox","due-soon","Allen Hatfield","606-546-3181","Southeastern KY",2021,2020,"2025-06-19"],
  ["21123","Larue","due-soon","Clara Bell","270-358-3135","Metro Louisville",2021,2020,"2025-09-15"],
  ["21125","Laurel","current","Todd Cromer","606-864-4200","Southeastern KY",2022,2021,"2025-11-07"],
  ["21127","Lawrence","due-soon","Amanda Bartley","606-638-4531","Northeastern KY",2020,2021,"2025-08-27"],
  ["21129","Lee","overdue","Betty Brown","606-464-4110","Eastern KY",2018,2019,"2023-03-18"],
  ["21131","Leslie","due-soon","Carl Wooten","606-672-2359","Eastern KY",2021,2020,"2025-07-09"],
  ["21133","Letcher","overdue","Frances Combs","606-633-2231","Eastern KY",2019,2018,"2023-11-23"],
  ["21135","Lewis","due-soon","Earl Myers","606-796-3786","Northeastern KY",2021,2020,"2025-06-04"],
  ["21137","Lincoln","current","Tina Campbell","606-365-2761","South-Central",2022,2021,"2025-10-19"],
  ["21139","Livingston","overdue","Dennis Duncan","270-928-2139","Pennyrile",2018,2019,"2024-04-08"],
  ["21141","Logan","current","Virginia Barker","270-726-4404","South-Central",2022,2021,"2025-12-03"],
  ["21143","Lyon","overdue","Harry Crouch","270-388-7144","Pennyrile",2019,2018,"2024-01-30"],
  ["21145","McCracken","current","Donna Johnson","270-444-4746","Purchase",2023,2022,"2026-01-16"],
  ["21147","McCreary","overdue","Loretta Ferguson","606-376-2322","Southeastern KY",2018,2019,"2023-07-05"],
  ["21149","McLean","overdue","Russell Fulkerson","270-273-3293","Green River",2019,2018,"2023-10-12"],
  ["21151","Madison","current","Keith House","859-623-1511","Bluegrass",2022,2021,"2025-11-21"],
  ["21153","Magoffin","not-submitted","Paula Arnett","606-349-4341","Eastern KY",null,null,"2022-12-08"],
  ["21155","Marion","not-submitted","Alice Downs","270-692-4402","Bluegrass",null,null,"2023-04-21"],
  ["21157","Marshall","current","Walter Lawrence","270-527-3535","Purchase",2022,2021,"2025-10-27"],
  ["21159","Martin","overdue","Garry Hatfield","606-298-3122","Eastern KY",2018,2019,"2023-06-30"],
  ["21161","Mason","current","Jane Brislin","606-564-3341","Northeastern KY",2022,2021,"2025-09-24"],
  ["21163","Meade","overdue","Calvin Jones","270-422-4973","Metro Louisville",2019,2018,"2023-08-16"],
  ["21165","Menifee","not-submitted","Yvonne Patrick","606-768-2800","Eastern KY",null,null,"2022-09-14"],
  ["21167","Mercer","not-submitted","Henry Duncan","859-734-4212","Bluegrass",null,null,"2023-01-09"],
  ["21169","Metcalfe","not-submitted","Susan Huff","270-432-4821","South-Central",null,null,"2022-07-27"],
  ["21171","Monroe","not-submitted","Charles Garrett","270-487-5531","South-Central",null,null,"2023-03-15"],
  ["21173","Montgomery","current","Melissa Lyons","859-498-8703","Bluegrass",2022,2021,"2025-12-18"],
  ["21175","Morgan","not-submitted","Jerry Rice","606-743-3512","Eastern KY",null,null,"2022-10-06"],
  ["21177","Muhlenberg","not-submitted","Karen Goode","270-338-1241","Pennyrile",null,null,"2023-05-11"],
  ["21179","Nelson","current","Phillip Hayden","502-348-3512","Metro Louisville",2022,2021,"2025-11-14"],
  ["21181","Nicholas","not-submitted","Frances Hunt","859-289-3741","Northern KY",null,null,"2022-06-22"],
  ["21183","Ohio","current","Brenda Hammond","270-298-4432","Green River",2022,2021,"2025-10-09"],
  ["21185","Oldham","current","Richard Duffy","502-222-4196","Metro Louisville",2023,2022,"2026-01-25"],
  ["21187","Owen","not-submitted","Nathan Curry","502-484-3321","Northern KY",null,null,"2023-02-18"],
  ["21189","Owsley","not-submitted","Teresa Howard","606-593-5701","Eastern KY",null,null,"2022-04-30"],
  ["21191","Pendleton","current","Gloria Sheehan","859-654-3391","Northern KY",2022,2021,"2025-10-16"],
  ["21193","Perry","current","Patrick Gibson","606-436-4614","Eastern KY",2022,2021,"2025-11-01"],
  ["21195","Pike","current","Donna Preece","606-433-7554","Eastern KY",2023,2022,"2026-01-11"],
  ["21197","Powell","not-submitted","Clifton Hall","606-663-4182","Eastern KY",null,null,"2023-06-03"],
  ["21199","Pulaski","current","Ann Harness","606-679-8025","South-Central",2022,2021,"2025-09-12"],
  ["21201","Robertson","not-submitted","Bobby Craig","606-724-5212","Northern KY",null,null,"2022-03-08"],
  ["21203","Rockcastle","not-submitted","Judy Pittman","606-256-4614","Southeastern KY",null,null,"2022-11-19"],
  ["21205","Rowan","not-submitted","Craig Caudill","606-784-5446","Northeastern KY",null,null,"2023-07-14"],
  ["21207","Russell","not-submitted","Sandra Doherty","270-343-2163","South-Central",null,null,"2023-01-28"],
  ["21209","Scott","current","Frank Schroader","502-863-7885","Bluegrass",2023,2022,"2025-12-28"],
  ["21211","Shelby","current","Kim Whitworth","502-633-1220","Metro Louisville",2022,2021,"2025-11-08"],
  ["21213","Simpson","not-submitted","Laura Kirby","270-586-8171","South-Central",null,null,"2023-08-22"],
  ["21215","Spencer","not-submitted","Amy Dunn","502-477-3215","Metro Louisville",null,null,"2023-04-05"],
  ["21217","Taylor","current","Carl Neal","270-465-4213","South-Central",2022,2021,"2025-10-24"],
  ["21219","Todd","not-submitted","Eddie Wells","270-265-2363","Pennyrile",null,null,"2022-12-16"],
  ["21221","Trigg","due-soon","Shannon Neel","270-522-6393","Pennyrile",2021,2020,"2025-09-26"],
  ["21223","Trimble","not-submitted","Jean Shipley","502-255-3211","Northern KY",null,null,"2022-06-11"],
  ["21225","Union","current","Eugene Adams","270-389-1501","Green River",2022,2021,"2025-11-22"],
  ["21227","Warren","current","Sam DeBusk","270-842-1633","South-Central",2023,2022,"2026-02-04"],
  ["21229","Washington","not-submitted","Beverly Duvall","859-336-5401","Bluegrass",null,null,"2023-03-29"],
  ["21231","Wayne","current","Greg Stephens","606-348-8011","South-Central",2022,2021,"2025-09-06"],
  ["21233","Webster","not-submitted","Maxine Stom","270-639-7071","Pennyrile",null,null,"2023-06-17"],
  ["21235","Whitley","current","Tony Bryson","606-549-6002","Southeastern KY",2022,2021,"2025-10-30"],
  ["21237","Wolfe","not-submitted","Martha Turner","606-668-3312","Eastern KY",null,null,"2022-08-04"],
  ["21239","Woodford","current","Justin Hall","859-873-4461","Bluegrass",2023,2022,"2026-01-31"],
];

export const KENTUCKY_COUNTIES: County[] = RAW.map(
  ([fips, name, status, director, phone, region, cempYear, hmpYear, lastComm]) => ({
    fips,
    name,
    status,
    region,
    director: {
      name: director,
      title: "Emergency Management Director",
      phone,
      email: makeEmail(director, name),
    },
    plans: makePlans(status, cempYear, hmpYear),
    lastCommunication: lastComm,
  })
);

export const COUNTIES_BY_FIPS: Record<string, County> = Object.fromEntries(
  KENTUCKY_COUNTIES.map((c) => [c.fips, c])
);

export const STATUS_META: Record<
  PlanStatus,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  current: {
    label: "Current",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-300",
    dot: "#16A34A",
  },
  "due-soon": {
    label: "Due Soon",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    dot: "#CA8A04",
  },
  overdue: {
    label: "Overdue",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-300",
    dot: "#EA580C",
  },
  "not-submitted": {
    label: "Not Submitted",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-300",
    dot: "#DC2626",
  },
};

export const MAP_COLORS: Record<PlanStatus, string> = {
  current: "#4ADE80",
  "due-soon": "#FDE047",
  overdue: "#FB923C",
  "not-submitted": "#F87171",
};
