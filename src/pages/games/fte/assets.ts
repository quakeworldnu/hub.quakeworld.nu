import { getAssetUrl } from "../services/cloudfront/cassets.ts";
import { idMaps } from "./idMaps.ts";
import { getMapTextures } from "./map_textures.ts";
import {
  DEMO_CONFIG_VERSION,
  DEMO_CSADDON_VERSION,
  QTV_CONFIG_VERSION,
} from "./meta.ts";
import type { FteAssets } from "./types.ts";

export function getQtvPlayerAssets(mapName: string): FteAssets {
  return {
    ...getGeneralAssets(),
    "id1/config.cfg": getAssetUrl(
      `fte/id1/config_qtv.cfg?version=${QTV_CONFIG_VERSION}`,
    ),
    "qw/csaddon.dat": getAssetUrl(
      `fte/qw/csaddon.dat?version=${DEMO_CSADDON_VERSION}`,
    ),
    ...getMapAssets(mapName),
  };
}

export function getDemoPlayerAssets(
  demoUrl: string,
  mapName: string,
): FteAssets {
  return {
    ...getGeneralAssets(),
    "id1/config.cfg": getAssetUrl(
      `fte/id1/config.cfg?version=${DEMO_CONFIG_VERSION}`,
    ),
    "qw/csaddon.dat": getAssetUrl(
      `fte/qw/csaddon.dat?version=${DEMO_CSADDON_VERSION}`,
    ),
    "qw/match.mvd.gz": demoUrl,
    ...getMapAssets(mapName),
  };
}

function getMapAssets(mapName: string): FteAssets {
  const litDir = idMaps.includes(mapName) ? "lits/id1_gpl" : "maps";

  const assets: FteAssets = {
    [`id1/maps/${mapName}.bsp`]: getAssetUrl(`maps/${mapName}.bsp`),
    [`id1/locs/${mapName}.loc`]: getAssetUrl(`maps/${mapName}.loc`),
    [`id1/maps/${mapName}.lit`]: getAssetUrl(`${litDir}/${mapName}.lit`),
  };

  if (idMaps.includes(mapName)) {
    return assets;
  }

  return {
    ...assets,
    ...getMapTextures(mapName),
  };
}

export function getGeneralAssets(): FteAssets {
  const filePaths = [
    "default.fmf",
    "ctf/fragfile.dat",
    "qw/fragfile.dat",

    "id1/textures/charsets/povo5f_xtm.png",
    "id1/crosshairs/xtm_dot.png",

    "id1/gfx.wad",
    "id1/gfx/anum_0.png",
    "id1/gfx/anum_1.png",
    "id1/gfx/anum_2.png",
    "id1/gfx/anum_3.png",
    "id1/gfx/anum_4.png",
    "id1/gfx/anum_5.png",
    "id1/gfx/anum_6.png",
    "id1/gfx/anum_7.png",
    "id1/gfx/anum_8.png",
    "id1/gfx/anum_9.png",
    "id1/gfx/anum_colon.png",
    "id1/gfx/anum_minus.png",
    "id1/gfx/anum_slash.png",
    "id1/gfx/face1.png",
    "id1/gfx/face2.png",
    "id1/gfx/face3.png",
    "id1/gfx/face4.png",
    "id1/gfx/face5.png",
    "id1/gfx/face_inv2.png",
    "id1/gfx/face_invis.png",
    "id1/gfx/face_invul2.png",
    "id1/gfx/face_p1.png",
    "id1/gfx/face_p2.png",
    "id1/gfx/face_p3.png",
    "id1/gfx/face_p4.png",
    "id1/gfx/face_p5.png",
    "id1/gfx/face_quad.png",
    "id1/gfx/ibar.png",
    "id1/gfx/inv2_lightng.png",
    "id1/gfx/inv2_nailgun.png",
    "id1/gfx/inv2_rlaunch.png",
    "id1/gfx/inv2_shotgun.png",
    "id1/gfx/inv2_snailgun.png",
    "id1/gfx/inv2_srlaunch.png",
    "id1/gfx/inv2_sshotgun.png",
    "id1/gfx/inv_lightng.png",
    "id1/gfx/inv_nailgun.png",
    "id1/gfx/inv_nails.png",
    "id1/gfx/inv_rlaunch.png",
    "id1/gfx/inv_rocket.png",
    "id1/gfx/inv_shells.png",
    "id1/gfx/inv_shotgun.png",
    "id1/gfx/inv_snailgun.png",
    "id1/gfx/inv_srlaunch.png",
    "id1/gfx/inv_sshotgun.png",
    "id1/gfx/inva1_lightng.png",
    "id1/gfx/inva1_nailgun.png",
    "id1/gfx/inva1_rlaunch.png",
    "id1/gfx/inva1_shotgun.png",
    "id1/gfx/inva1_snailgun.png",
    "id1/gfx/inva1_srlaunch.png",
    "id1/gfx/inva1_sshotgun.png",
    "id1/gfx/inva2_lightng.png",
    "id1/gfx/inva2_nailgun.png",
    "id1/gfx/inva2_rlaunch.png",
    "id1/gfx/inva2_shotgun.png",
    "id1/gfx/inva2_snailgun.png",
    "id1/gfx/inva2_srlaunch.png",
    "id1/gfx/inva2_sshotgun.png",
    "id1/gfx/inva3_lightng.png",
    "id1/gfx/inva3_nailgun.png",
    "id1/gfx/inva3_rlaunch.png",
    "id1/gfx/inva3_shotgun.png",
    "id1/gfx/inva3_snailgun.png",
    "id1/gfx/inva3_srlaunch.png",
    "id1/gfx/inva3_sshotgun.png",
    "id1/gfx/inva4_lightng.png",
    "id1/gfx/inva4_nailgun.png",
    "id1/gfx/inva4_rlaunch.png",
    "id1/gfx/inva4_shotgun.png",
    "id1/gfx/inva4_snailgun.png",
    "id1/gfx/inva4_srlaunch.png",
    "id1/gfx/inva4_sshotgun.png",
    "id1/gfx/inva5_lightng.png",
    "id1/gfx/inva5_nailgun.png",
    "id1/gfx/inva5_rlaunch.png",
    "id1/gfx/inva5_shotgun.png",
    "id1/gfx/inva5_snailgun.png",
    "id1/gfx/inva5_srlaunch.png",
    "id1/gfx/inva5_sshotgun.png",
    "id1/gfx/num_0.png",
    "id1/gfx/num_1.png",
    "id1/gfx/num_2.png",
    "id1/gfx/num_3.png",
    "id1/gfx/num_4.png",
    "id1/gfx/num_5.png",
    "id1/gfx/num_6.png",
    "id1/gfx/num_7.png",
    "id1/gfx/num_8.png",
    "id1/gfx/num_9.png",
    "id1/gfx/num_colon.png",
    "id1/gfx/num_minus.png",
    "id1/gfx/num_slash.png",
    "id1/gfx/sb_armor1.png",
    "id1/gfx/sb_armor2.png",
    "id1/gfx/sb_armor3.png",
    "id1/gfx/sb_cells.png",
    "id1/gfx/sb_invis.png",
    "id1/gfx/sb_invuln.png",
    "id1/gfx/sb_key1.png",
    "id1/gfx/sb_key2.png",
    "id1/gfx/sb_nails.png",
    "id1/gfx/sb_quad.png",
    "id1/gfx/sb_rocket.png",
    "id1/gfx/sb_shells.png",
    "id1/gfx/sb_sigil1.png",
    "id1/gfx/sb_sigil2.png",
    "id1/gfx/sb_sigil3.png",
    "id1/gfx/sb_sigil4.png",
    "id1/gfx/sb_suit.png",
    "id1/gfx/sba1_key1.png",
    "id1/gfx/sba1_key2.png",
    "id1/gfx/sba2_key1.png",
    "id1/gfx/sba2_key2.png",
    "id1/gfx/sba3_key1.png",
    "id1/gfx/sba3_key2.png",
    "id1/gfx/sba4_key1.png",
    "id1/gfx/sba4_key2.png",
    "id1/gfx/sba5_key1.png",
    "id1/gfx/sba5_key2.png",

    "id1/maps/b_batt0.bsp",
    "id1/maps/b_batt1.bsp",
    "id1/maps/b_bh10.bsp",
    "id1/maps/b_bh100.bsp",
    "id1/maps/b_bh25.bsp",
    "id1/maps/b_explob.bsp",
    "id1/maps/b_nail0.bsp",
    "id1/maps/b_nail1.bsp",
    "id1/maps/b_rock0.bsp",
    "id1/maps/b_rock1.bsp",
    "id1/maps/b_shell0.bsp",
    "id1/maps/b_shell1.bsp",

    "id1/particles/blood.cfg",
    "id1/particles/bubble-trail.cfg",
    "id1/particles/explosion.cfg",
    "id1/particles/flame.cfg",
    "id1/particles/grenade.cfg",
    "id1/particles/particlefont.png",
    "id1/particles/rocket.cfg",
    "id1/particles/runes.cfg",
    "id1/particles/torch.cfg",

    "id1/progs/armor.mdl",
    "id1/progs/backpack.mdl",
    "id1/progs/bit.mdl",
    "id1/progs/bolt.mdl",
    "id1/progs/bolt2.mdl",
    "id1/progs/bolt3.mdl",
    "id1/progs/end1.mdl",
    "id1/progs/end2.mdl",
    "id1/progs/end3.mdl",
    "id1/progs/end4.mdl",
    "id1/progs/eyes.mdl",
    "id1/progs/flag.mdl",
    "id1/progs/flame.mdl",
    "id1/progs/flame2.mdl",
    "id1/progs/g_light.mdl",
    "id1/progs/g_nail.mdl",
    "id1/progs/g_nail2.mdl",
    "id1/progs/g_rock.mdl",
    "id1/progs/g_rock2.mdl",
    "id1/progs/g_shot.mdl",
    "id1/progs/gib1.mdl",
    "id1/progs/gib2.mdl",
    "id1/progs/gib3.mdl",
    "id1/progs/grenade.md3",
    "id1/progs/grenade_0.skin",
    "id1/progs/h_player.mdl",
    "id1/progs/invisibl.mdl",
    "id1/progs/invulner.mdl",
    "id1/progs/lavaball.mdl",
    "id1/progs/missile.md3",
    "id1/progs/missile_0.skin",
    "id1/progs/player.mdl",
    "id1/progs/quaddama.mdl",
    // "id1/progs/s_bubble.spr",
    // "id1/progs/s_explod.spr",
    "id1/progs/s_spike.mdl",
    "id1/progs/spawn.mdl",
    "id1/progs/spike.mdl",
    "id1/progs/star.mdl",
    "id1/progs/suit.mdl",
    "id1/progs/v_axe.mdl",
    "id1/progs/v_coil.mdl",
    "id1/progs/v_light.mdl",
    "id1/progs/v_nail.mdl",
    "id1/progs/v_nail2.mdl",
    "id1/progs/v_rock.mdl",
    "id1/progs/v_rock2.mdl",
    "id1/progs/v_shot.mdl",
    "id1/progs/v_shot1.mdl",
    "id1/progs/v_shot2.mdl",
    "id1/progs/v_spike.mdl",
    "id1/progs/v_star.mdl",
    "id1/progs/vwplayer.mdl",
    "id1/progs/w_axe.mdl",
    "id1/progs/w_g_key.mdl",
    "id1/progs/w_light.mdl",
    "id1/progs/w_nail.mdl",
    "id1/progs/w_nail2.mdl",
    "id1/progs/w_rock.mdl",
    "id1/progs/w_rock2.mdl",
    "id1/progs/w_s_key.mdl",
    "id1/progs/w_shot.mdl",
    "id1/progs/w_shot2.mdl",
    "id1/progs/wizard.mdl",
    "id1/progs/zom_gib.mdl",

    "id1/scripts/shell.shader",

    "id1/skins/ctf_blue.jpg",
    "id1/skins/ctf_red.jpg",
    "id1/skins/blue.jpg",
    "id1/skins/blue_solid.png",
    "id1/skins/cyan.jpg",
    "id1/skins/cyan_solid.png",
    "id1/skins/enemy.jpg",
    "id1/skins/green.jpg",
    "id1/skins/green_solid.png",
    "id1/skins/pink.jpg",
    "id1/skins/pink_solid.png",
    "id1/skins/red.jpg",
    "id1/skins/red_solid.png",
    "id1/skins/team.jpg",
    "id1/skins/white.jpg",
    "id1/skins/white_solid.png",
    "id1/skins/yellow.jpg",
    "id1/skins/yellow_solid.png",

    "id1/sound/ambience/buzz1.wav",
    "id1/sound/ambience/comp1.wav",
    "id1/sound/ambience/drip1.wav",
    "id1/sound/ambience/drone6.wav",
    "id1/sound/ambience/fire1.wav",
    "id1/sound/ambience/fl_hum1.wav",
    "id1/sound/ambience/hum1.wav",
    "id1/sound/ambience/suck1.wav",
    "id1/sound/ambience/swamp1.wav",
    "id1/sound/ambience/swamp2.wav",
    "id1/sound/ambience/thunder1.wav",
    "id1/sound/ambience/water1.wav",
    "id1/sound/ambience/wind2.wav",
    "id1/sound/ambience/windfly.wav",
    "id1/sound/buttons/airbut1.wav",
    "id1/sound/buttons/switch02.wav",
    "id1/sound/buttons/switch04.wav",
    "id1/sound/buttons/switch21.wav",
    "id1/sound/doors/airdoor1.wav",
    "id1/sound/doors/airdoor2.wav",
    "id1/sound/doors/basesec1.wav",
    "id1/sound/doors/basesec2.wav",
    "id1/sound/doors/basetry.wav",
    "id1/sound/doors/baseuse.wav",
    "id1/sound/doors/ddoor1.wav",
    "id1/sound/doors/ddoor2.wav",
    "id1/sound/doors/doormv1.wav",
    "id1/sound/doors/drclos4.wav",
    "id1/sound/doors/hydro1.wav",
    "id1/sound/doors/hydro2.wav",
    "id1/sound/doors/latch2.wav",
    "id1/sound/doors/medtry.wav",
    "id1/sound/doors/meduse.wav",
    "id1/sound/doors/runetry.wav",
    "id1/sound/doors/runeuse.wav",
    "id1/sound/doors/stndr1.wav",
    "id1/sound/doors/stndr2.wav",
    "id1/sound/doors/winch2.wav",
    "id1/sound/items/armor1.wav",
    "id1/sound/items/damage.wav",
    "id1/sound/items/damage2.wav",
    "id1/sound/items/damage3.wav",
    "id1/sound/items/health1.wav",
    "id1/sound/items/inv1.wav",
    "id1/sound/items/inv2.wav",
    "id1/sound/items/inv3.wav",
    "id1/sound/items/itembk2.wav",
    "id1/sound/items/protect.wav",
    "id1/sound/items/protect2.wav",
    "id1/sound/items/protect3.wav",
    "id1/sound/items/r_item1.wav",
    "id1/sound/items/r_item2.wav",
    "id1/sound/items/suit.wav",
    "id1/sound/items/suit2.wav",
    "id1/sound/misc/flagcap.wav",
    "id1/sound/misc/flagtk.wav",
    "id1/sound/misc/h2ohit1.wav",
    "id1/sound/misc/medkey.wav",
    "id1/sound/misc/menu1.wav",
    "id1/sound/misc/menu2.wav",
    "id1/sound/misc/menu3.wav",
    "id1/sound/misc/null.wav",
    "id1/sound/misc/outwater.wav",
    "id1/sound/misc/power.wav",
    "id1/sound/misc/r_tele1.wav",
    "id1/sound/misc/r_tele2.wav",
    "id1/sound/misc/r_tele3.wav",
    "id1/sound/misc/r_tele4.wav",
    "id1/sound/misc/r_tele5.wav",
    "id1/sound/misc/runekey.wav",
    "id1/sound/misc/secret.wav",
    "id1/sound/misc/talk.wav",
    "id1/sound/misc/trigger1.wav",
    "id1/sound/misc/water1.wav",
    "id1/sound/misc/water2.wav",
    "id1/sound/plats/medplat1.wav",
    "id1/sound/plats/medplat2.wav",
    "id1/sound/plats/plat1.wav",
    "id1/sound/plats/plat2.wav",
    "id1/sound/plats/train1.wav",
    "id1/sound/plats/train2.wav",
    "id1/sound/player/axhit1.wav",
    "id1/sound/player/axhit2.wav",
    "id1/sound/player/death1.wav",
    "id1/sound/player/death2.wav",
    "id1/sound/player/death3.wav",
    "id1/sound/player/death4.wav",
    "id1/sound/player/death5.wav",
    "id1/sound/player/drown1.wav",
    "id1/sound/player/drown2.wav",
    "id1/sound/player/gasp1.wav",
    "id1/sound/player/gasp2.wav",
    "id1/sound/player/gib.wav",
    "id1/sound/player/h2odeath.wav",
    "id1/sound/player/h2ojump.wav",
    "id1/sound/player/inh2o.wav",
    "id1/sound/player/inlava.wav",
    "id1/sound/player/land.wav",
    "id1/sound/player/land2.wav",
    "id1/sound/player/lburn1.wav",
    "id1/sound/player/lburn2.wav",
    "id1/sound/player/pain1.wav",
    "id1/sound/player/pain2.wav",
    "id1/sound/player/pain3.wav",
    "id1/sound/player/pain4.wav",
    "id1/sound/player/pain5.wav",
    "id1/sound/player/pain6.wav",
    "id1/sound/player/plyrjmp8.wav",
    "id1/sound/player/slimbrn2.wav",
    "id1/sound/player/teledth1.wav",
    "id1/sound/player/tornoff2.wav",
    "id1/sound/player/udeath.wav",
    "id1/sound/ra/1.wav",
    "id1/sound/ra/2.wav",
    "id1/sound/ra/3.wav",
    "id1/sound/ra/fight.wav",
    "id1/sound/rune/rune1.wav",
    "id1/sound/rune/rune2.wav",
    "id1/sound/rune/rune22.wav",
    "id1/sound/rune/rune3.wav",
    "id1/sound/rune/rune4.wav",
    "id1/sound/weapons/ax1.wav",
    "id1/sound/weapons/bounce.wav",
    "id1/sound/weapons/bounce2.wav",
    "id1/sound/weapons/chain1.wav",
    "id1/sound/weapons/chain2.wav",
    "id1/sound/weapons/chain3.wav",
    "id1/sound/weapons/grenade.wav",
    "id1/sound/weapons/guncock.wav",
    "id1/sound/weapons/lhit.wav",
    "id1/sound/weapons/lock4.wav",
    "id1/sound/weapons/lstart.wav",
    "id1/sound/weapons/pkup.wav",
    "id1/sound/weapons/r_exp3.wav",
    "id1/sound/weapons/ric1.wav",
    "id1/sound/weapons/ric2.wav",
    "id1/sound/weapons/ric3.wav",
    "id1/sound/weapons/rocket1i.wav",
    "id1/sound/weapons/sgun1.wav",
    "id1/sound/weapons/shotgn2.wav",
    "id1/sound/weapons/spike2.wav",
    "id1/sound/weapons/tink1.wav",

    "id1/textures/#lava1.jpg",
    "id1/textures/#lava1_luma.jpg",
    "id1/textures/#teleport.jpg",
    "id1/textures/grenade.png",
    "id1/textures/grenade_glow.png",
    "id1/textures/missile.png",
    "id1/textures/missile_glow.png",

    "id1/textures/bmodels/+0_med100.jpg",
    "id1/textures/bmodels/+0_med25.jpg",
    "id1/textures/bmodels/+0_med25s.jpg",
    "id1/textures/bmodels/+1_med100.jpg",
    "id1/textures/bmodels/+1_med25.jpg",
    "id1/textures/bmodels/+1_med25s.jpg",
    "id1/textures/bmodels/+2_med100.jpg",
    "id1/textures/bmodels/+2_med25.jpg",
    "id1/textures/bmodels/+3_med100.jpg",
    "id1/textures/bmodels/+3_med25.jpg",
    "id1/textures/bmodels/batt0sid.jpg",
    "id1/textures/bmodels/batt0top.jpg",
    "id1/textures/bmodels/batt1sid.jpg",
    "id1/textures/bmodels/batt1top.jpg",
    "id1/textures/bmodels/med100.jpg",
    "id1/textures/bmodels/med3_0.jpg",
    "id1/textures/bmodels/med3_1.jpg",
    "id1/textures/bmodels/nail0sid.jpg",
    "id1/textures/bmodels/nail0top.jpg",
    "id1/textures/bmodels/nail1sid.jpg",
    "id1/textures/bmodels/nail1top.jpg",
    "id1/textures/bmodels/rock0sid.jpg",
    "id1/textures/bmodels/rock1sid.jpg",
    "id1/textures/bmodels/rockettop.jpg",
    "id1/textures/bmodels/shot0sid.jpg",
    "id1/textures/bmodels/shot0top.jpg",
    "id1/textures/bmodels/shot1sid.jpg",
    "id1/textures/bmodels/shot1top.jpg",

    "id1/textures/models/armor.mdl_0.png",
    "id1/textures/models/armor.mdl_1.png",
    "id1/textures/models/armor.mdl_2.png",
    "id1/textures/models/backpack.mdl_0.jpg",
    "id1/textures/models/end1.mdl_0.png",
    "id1/textures/models/end2.mdl_0.png",
    "id1/textures/models/end3.mdl_0.png",
    "id1/textures/models/end4.mdl_0.png",
    "id1/textures/models/flag.mdl_0.jpg",
    "id1/textures/models/flag.mdl_1.jpg",
    "id1/textures/models/gib1.mdl_0.jpg",
    "id1/textures/models/gib2.mdl_0.jpg",
    "id1/textures/models/h_player.mdl_0.jpg",
    "id1/textures/models/quaddama.mdl_0.png",
    "id1/textures/models/v_axe.mdl_0.jpg",

    "id1/textures/particles/bubble.png",
    "id1/textures/particles/flame.png",
    "id1/textures/particles/generic.png",
    "id1/textures/particles/rfire.png",
    "id1/textures/particles/smoke.png",
    "id1/textures/particles/v_rock2_flash.png",
    "id1/textures/particles/v_shot2_flash.png",

    "id1/textures/sfx/quad.png",

    "id1/textures/tracker/axe.png",
    "id1/textures/tracker/coil.png",
    "id1/textures/tracker/discharge.png",
    "id1/textures/tracker/drown.png",
    "id1/textures/tracker/fall.png",
    "id1/textures/tracker/gl.png",
    "id1/textures/tracker/lava.png",
    "id1/textures/tracker/lg.png",
    "id1/textures/tracker/ng.png",
    "id1/textures/tracker/q.png",
    "id1/textures/tracker/rail.png",
    "id1/textures/tracker/rl.png",
    "id1/textures/tracker/sg.png",
    "id1/textures/tracker/slime.png",
    "id1/textures/tracker/sng.png",
    "id1/textures/tracker/squish.png",
    "id1/textures/tracker/ssg.png",
    "id1/textures/tracker/stomp.png",
    "id1/textures/tracker/tele.png",
    "id1/textures/tracker/tkills.png",
    "id1/textures/tracker/trap.png",
  ];

  const assets: FteAssets = {};

  for (const path of filePaths) {
    assets[path] = getAssetUrl(`fte/${path}`);
  }

  return assets;
}
