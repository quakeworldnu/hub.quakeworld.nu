// mvdsv hosts that answer stun binding requests (https://github.com/QW-Group/mvdsv/pull/241):
// hostname (preferred) or ip => port that answered. fte servers are detected by version instead.
// generated 2026-11-12 by sending one stun binding request per ip (up to 3 ports)
// to all game servers listed by api.quake.world.
// hostnames are used when the server's hostname resolves to the answering ip.
export const stunHosts: ReadonlyMap<string, number> = new Map([
  ["berlin.qwsv.net", 27500], // Berlin KTX Server #1 (34.32.25.96)
  ["copenhagen.qwsv.net", 27500], // Copenhagen KTX Server #1 (192.121.119.117)
  ["hamburg-old.qwsv.net", 27500], // Hamburg-old KTX Server #1 (212.53.165.161)
  ["hamburg.qwsv.net", 27500], // Hamburg KTX Server #1 (15.220.152.43)
  ["hamina.qwsv.net", 27500], // Hamina KTX Server #1 (34.88.33.175)
  ["la.qwsrv.com", 28501], // la.quake.world:28501 NAQW (45.32.75.169)
  ["lisbon.qlash.com.br", 28501], // ! Qlash Lisbon | Antilag:28501 (103.63.29.40)
  ["lomma.qwsv.net", 27500], // ToT Lomma KTX Server #1 (78.72.109.73)
  ["miami.qlash.com.br", 28501], // ! Qlash Miami | Antilag:28501 (140.235.125.12)
  ["ny.qwsrv.com", 28501], // ny.quake.world:28501 NAQW (149.28.62.121)
  ["quake.se", 28501], // QUAKE.SE KTX:28501 (46.227.68.148)
  ["qw.0f.se", 28501], // QW.0F.SE KTX:28501 (130.242.114.28)
  ["qw.qlash.com.br", 28501], // ! Qlash Sao Paulo 2 | Antilag:28501 (144.22.139.117)
  ["saopaulo.qlash.com.br", 28501], // ! Qlash Sao Paulo | Antilag:28501 (177.93.131.174)
  ["vilnius.qwsv.net", 27500], // Vilnius KTX Server #1 (162.254.86.73)
  ["16.50.158.34", 28501], // Thickshaker Vic Antilag #1
  ["45.124.55.179", 28501], // Fartshaker SA Antilag #1
  ["70.39.95.254", 28501], // DeepFrag Denver Strafe Coach:29001
  ["144.6.14.154", 28501], // Sleepshaker NSW Antilag #1
  ["144.202.66.126", 28501], // DeepFrag Dallas:28501
  ["155.138.204.79", 28501], // DeepFrag Atlanta:28501
  ["203.29.240.182", 28501], // Swoopshaker WA  Antilag #1
]);
