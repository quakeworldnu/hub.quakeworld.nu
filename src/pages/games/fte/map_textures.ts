import { FteAssets } from "./types.ts";

const FTE_ASSETS_URL =
  "https://raw.githubusercontent.com/vikpe/fte-web-assets/main";

export function getMapTextures(mapName: string): FteAssets {
  const filenames = texturesPerMapName[mapName] ?? [];
  const filepaths = filenames.map((t) => `id1/textures/${mapName}/${t}`);
  const assets: FteAssets = {};

  for (const path of filepaths) {
    assets[path] = `${FTE_ASSETS_URL}/${path.replace("#", "%23")}`;
  }

  return assets;
}

const texturesPerMapName: { [key: string]: string[] } = {
  italy: ["barrel0a.jpg", "barrel0b.jpg", "bricks0a.jpg", "bricks1a.jpg", "bricks1b.jpg", "bricks2a.jpg", "bricks2b.jpg", "bricks2c.jpg", "bricks3a.jpg", "door00.jpg", "door01.jpg", "flag_it.jpg", "floorw1a.jpg", "hatch0a.jpg", "lamp0a_a.jpg", "lamp0a_b.jpg", "misc113.jpg", "rainpipe00.jpg", "road1a.jpg", "road1b.jpg", "roof0a.jpg", "sign0a.jpg", "sign0b.jpg", "sign1a.jpg", "sign1b.jpg", "sign2a.jpg", "sign2b.jpg", "sky1qkr_alpha.jpg", "sky1qkr_solid.jpg", "stucco1a.jpg", "stucco1b.jpg", "stucco1w.jpg", "stucco2a.jpg", "stucco2b.jpg", "stucco2c.jpg", "stucco3a.jpg", "stucco4a.jpg", "stucco4w.jpg", "stucco4z.jpg", "stucco5a.jpg", "stucco6a.jpg", "stucco6z.jpg", "stucco7a.jpg", "stucco7b.jpg", "stucco7c.jpg", "stucco7d.jpg", "stucco8a.jpg", "stucco8b.jpg", "stucco8z.jpg", "stucco9a.jpg", "stucco9w.jpg", "stucco10a.jpg", "stucco10b.jpg", "stucco10w.jpg", "w0fram1a.jpg", "w0fram1b.jpg", "w0glass0.jpg", "w0glass1.jpg", "w0glass2.jpg", "w1fram1a.jpg", "w1fram1b.jpg", "w1glass1.jpg", "w1glass2.jpg", "w1glass3.jpg", "w1glass4.jpg", "w1glass5.jpg", "window0a.jpg", "window1a.jpg", "wood1a.jpg", "wood2a.jpg", "wood3a.jpg"],
  nuke_beta2: ["#water_l_tg3.jpg", "+0~watergrid.jpg", "+1~watergrid.jpg", "+2~watergrid.jpg", "admin_256.jpg", "asphalt01.jpg", "bdngtop.jpg", "cedcreek_128.jpg", "conc001.jpg", "concrete02.jpg", "cont_back_blue.jpg", "cont_back_red.jpg", "cont_front_blue.jpg", "cont_front_red.jpg", "cont_side_blue.jpg", "cont_side_red.jpg", "cont_top_blue.jpg", "cont_top_red.jpg", "corrugated001a.jpg", "crate01_ft.jpg", "crate01_sd.jpg", "crate01_up.jpg", "crate02_ft.jpg", "crate02_sd.jpg", "crate03_ft.jpg", "crate03_sd.jpg", "crwlspc.jpg", "ctrlpnl.jpg", "curb001.jpg", "door001.jpg", "door001a.jpg", "door002.jpg", "doorframe01.jpg", "dt_conc.jpg", "grass.jpg", "grassblend.jpg", "hrcp001.jpg", "hrcp002.jpg", "hrct01.jpg", "hrct01_brown.jpg", "hrct01_white.jpg", "hrcw001.jpg", "hrcw006.jpg", "hrcwall08.jpg", "hrcwp001.jpg", "hrcwp001g.jpg", "hrft001.jpg", "hrft002.jpg", "hrft002_navyb.jpg", "hrmc001.jpg", "hrmc001b.jpg", "hrmc002.jpg", "hrmf001.jpg", "hrmw003.jpg", "labdoor01.jpg", "labdror.jpg", "labtrim01.jpg", "labwll01.jpg", "met_hmr_g_1.jpg", "met_hmr_g_2.jpg", "met_hmr_g_2s.jpg", "metalsupporty.jpg", "metalsupporty_b.jpg", "nuke_closet_2.jpg", "nukegrnd.jpg", "nwallbrown.jpg", "nwallred.jpg", "nwallwired.jpg", "nwdwaos.jpg", "nwdwaos4.jpg", "opt_autobot.jpg", "opt_defend.jpg", "opt_front.jpg", "opt_front2.jpg", "opt_license_r.jpg", "opt_license_w.jpg", "opt_light.jpg", "opt_steel.jpg", "opt_tire.jpg", "opt_tire2.jpg", "opt_wheel.jpg", "pntflr01.jpg", "rdoor01.jpg", "sign_authorize.jpg", "silo_base.jpg", "solid_blue_door.jpg", "stair001.jpg", "trimtop.jpg", "vendor_chips.jpg", "vendor_cig.jpg", "vendor_soda.jpg", "wdwtrim02.jpg"],
  schloss: ["016.jpg", "017.jpg", "019.jpg", "020.jpg", "040.jpg", "107.jpg"],
  qobblestone_beta4: ["#qobtele2.jpg", "003.jpg", "026.jpg", "061.jpg", "065.jpg", "066.jpg", "069.jpg", "071.jpg", "072.jpg", "086.jpg", "088.jpg", "090.jpg", "096.jpg", "101.jpg", "102.jpg", "110.jpg", "113.jpg", "114.jpg", "115.jpg", "125.jpg", "128.jpg", "133.jpg", "141.jpg", "148.jpg", "153.jpg", "154.jpg", "158.jpg", "160.jpg", "163.jpg", "164.jpg", "crate0_side.jpg", "crate0_top.jpg", "ground1_2.jpg", "lamp0a_a.jpg", "lamp0a_b.jpg", "road1c.jpg", "sky1qkr_alpha.jpg", "sky1qkr_solid.jpg"],
};
