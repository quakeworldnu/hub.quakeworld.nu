import * as React from "react";
import * as playerStyle from "./fte.module.scss";
import screenfull from "./screenfull";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faVolumeLow,
  faVolumeHigh,
  faVolumeXmark,
  faVolumeOff,
  faExpand,
  faGauge,
} from "@fortawesome/free-solid-svg-icons";
import Progressbar from "./progressbar";

import { window, document } from "browser-monads";

function withPrefix(path) {
  return `/assets/static/${path}`;
}

function secondsToString(duration) {
  const durationMinutes = Math.floor(duration / 60).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  const durationSeconds = Math.floor(duration % 60).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  return `${durationMinutes}:${durationSeconds}`;
}

const easingTime = 1500.0;

class FteComponent extends React.Component {
  state = {
    loadProgress: 0,
    demo: null,
    refreshInterval: null,
    gametime: 0,
    playing: true,
    playbackSpeed: 100,
    targetSpeed: 100,
    targetSpeedArrivalTime: 100,
    volume: Math.sqrt(0.05),
    volumeMuted: false,
    volumeHover: false,
    volumeIcon: faVolumeLow,
    playerControlTimeout: 0,
    firstRefresh: true,
    initialSpeed: null,
    initialPlayer: null,
    initialPosition: null,
  };

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.playerRef = React.createRef();
    this.playing = true;
    this.playbackSpeed = 100;
    this.duration = secondsToString(this.props.duration);
  }

  componentDidMount() {
    const baseUrl = this.props.demoBaseUrl;
    const demoUrl = `${baseUrl}/${this.props.directory}/${encodeURIComponent(
      this.props.demo,
    )}.gz`;

    const assetsUrl =
      "https://raw.githubusercontent.com/qw-ctf/qtube-assets/assets";
    const targetMapBsp = "id1/maps/" + this.props.map + ".bsp";
    const targetMapLit = "id1/maps/" + this.props.map + ".lit";

    const demoMountPath = /.+.mvd/.test(this.props.demo)
      ? "qw/match.mvd.gz"
      : "id1/match.dem.gz";

    const mapContent = /(dm[1-7]|e[1-4]m[1-8])/.test(this.props.map)
      ? {
          [targetMapBsp]: `https://raw.githubusercontent.com/fzwoch/quake_map_source/master/bsp/${this.props.map}.bsp`,
          [targetMapLit]: `https://media.githubusercontent.com/media/qw-ctf/lits/main/jscolour/id1_gpl/${this.props.map}.lit`,
        }
      : this.props.map === "mammoth" || this.props.map === "ctf5"
      ? {
          [targetMapBsp]: `https://media.githubusercontent.com/media/qw-ctf/qtube-maps/main/${this.props.map}.bsp`,
        }
      : {
          [targetMapBsp]: `https://raw.githubusercontent.com/nQuake/distfiles/master/sv-maps/qw/maps/${this.props.map}.bsp`,
          [targetMapLit]: `https://media.githubusercontent.com/media/qw-ctf/lits/main/jscolour/maps/${this.props.map}.lit`,
        };

    const assets = {
      "default.fmf": withPrefix("/data/default.fmf"),
      "id1/config.cfg": withPrefix("/data/id1/config.cfg"),
      "id1/crosshairs/crossdeurk.png": `${assetsUrl}/crosshairs/crossdeurk.png`,
      "id1/gfx/ranking.png": `${assetsUrl}/gfx/ranking.png`,
      "id1/gfx.wad": `${assetsUrl}/gfx.wad`,
      "id1/maps/b_batt0.bsp": `${assetsUrl}/maps/b_batt0.bsp`,
      "id1/maps/b_batt1.bsp": `${assetsUrl}/maps/b_batt1.bsp`,
      "id1/maps/b_bh100.bsp": `${assetsUrl}/maps/b_bh100.bsp`,
      "id1/maps/b_bh10.bsp": `${assetsUrl}/maps/b_bh10.bsp`,
      "id1/maps/b_bh25.bsp": `${assetsUrl}/maps/b_bh25.bsp`,
      "id1/maps/b_explob.bsp": `${assetsUrl}/maps/b_explob.bsp`,
      "id1/maps/b_nail0.bsp": `${assetsUrl}/maps/b_nail0.bsp`,
      "id1/maps/b_nail1.bsp": `${assetsUrl}/maps/b_nail1.bsp`,
      "id1/maps/b_rock0.bsp": `${assetsUrl}/maps/b_rock0.bsp`,
      "id1/maps/b_rock1.bsp": `${assetsUrl}/maps/b_rock1.bsp`,
      "id1/maps/b_shell0.bsp": `${assetsUrl}/maps/b_shell0.bsp`,
      "id1/maps/b_shell1.bsp": `${assetsUrl}/maps/b_shell1.bsp`,
      "id1/particles/blood.cfg": `${assetsUrl}/particles/blood.cfg`,
      "id1/particles/bubble-trail.cfg": `${assetsUrl}/particles/bubble-trail.cfg`,
      "id1/particles/explosion.cfg": `${assetsUrl}/particles/explosion.cfg`,
      "id1/particles/flame.cfg": `${assetsUrl}/particles/flame.cfg`,
      "id1/particles/grenade.cfg": `${assetsUrl}/particles/grenade.cfg`,
      "id1/particles/rocket.cfg": `${assetsUrl}/particles/rocket.cfg`,
      "id1/particles/runes.cfg": `${assetsUrl}/particles/runes.cfg`,
      "id1/particles/teleport.cfg": `${assetsUrl}/particles/teleport.cfg`,
      "id1/particles/torch.cfg": `${assetsUrl}/particles/torch.cfg`,
      "id1/particles/particlefont.png": `${assetsUrl}/particles/particlefont.png`,
      "id1/progs/armor.mdl": `${assetsUrl}/progs/armor.mdl`,
      "id1/progs/backpack.mdl": `${assetsUrl}/progs/backpack.mdl`,
      "id1/progs/bit.mdl": `${assetsUrl}/progs/bit.mdl`,
      "id1/progs/bolt2.mdl": `${assetsUrl}/progs/bolt2.mdl`,
      "id1/progs/bolt3.mdl": `${assetsUrl}/progs/bolt3.mdl`,
      "id1/progs/bolt.mdl": `${assetsUrl}/progs/bolt.mdl`,
      "id1/progs/end1.mdl": `${assetsUrl}/progs/end1.mdl`,
      "id1/progs/end2.mdl": `${assetsUrl}/progs/end2.mdl`,
      "id1/progs/end3.mdl": `${assetsUrl}/progs/end3.mdl`,
      "id1/progs/end4.mdl": `${assetsUrl}/progs/end4.mdl`,
      "id1/progs/eyes.mdl": `${assetsUrl}/progs/eyes.mdl`,
      "id1/progs/flag.mdl": `${assetsUrl}/progs/flag.mdl`,
      "id1/progs/flame2.mdl": `${assetsUrl}/progs/flame2.mdl`,
      "id1/progs/flame.mdl": `${assetsUrl}/progs/flame.mdl`,
      "id1/progs/gib1.mdl": `${assetsUrl}/progs/gib1.mdl`,
      "id1/progs/gib2.mdl": `${assetsUrl}/progs/gib2.mdl`,
      "id1/progs/gib3.mdl": `${assetsUrl}/progs/gib3.mdl`,
      "id1/progs/g_light.mdl": `${assetsUrl}/progs/g_light.mdl`,
      "id1/progs/g_nail2.mdl": `${assetsUrl}/progs/g_nail2.mdl`,
      "id1/progs/g_nail.mdl": `${assetsUrl}/progs/g_nail.mdl`,
      "id1/progs/grenade_0.skin": `${assetsUrl}/progs/grenade_0.skin`,
      "id1/progs/grenade.md3": `${assetsUrl}/progs/grenade.md3`,
      "id1/progs/g_rock2.mdl": `${assetsUrl}/progs/g_rock2.mdl`,
      "id1/progs/g_rock.mdl": `${assetsUrl}/progs/g_rock.mdl`,
      "id1/progs/g_shot.mdl": `${assetsUrl}/progs/g_shot.mdl`,
      "id1/progs/h_player.mdl": `${assetsUrl}/progs/h_player.mdl`,
      "id1/progs/invisibl.mdl": `${assetsUrl}/progs/invisibl.mdl`,
      "id1/progs/invulner.mdl": `${assetsUrl}/progs/invulner.mdl`,
      "id1/progs/lavaball.mdl": `${assetsUrl}/progs/lavaball.mdl`,
      "id1/progs/missile_0.skin": `${assetsUrl}/progs/missile_0.skin`,
      "id1/progs/missile.md3": `${assetsUrl}/progs/missile.md3`,
      "id1/progs/player.mdl": `${assetsUrl}/progs/player.mdl`,
      "id1/progs/quaddama.mdl": `${assetsUrl}/progs/quaddama.mdl`,
      "id1/progs/spike.mdl": `${assetsUrl}/progs/spike.mdl`,
      "id1/progs/s_spike.mdl": `${assetsUrl}/progs/s_spike.mdl`,
      "id1/progs/star.mdl": `${assetsUrl}/progs/star.mdl`,
      "id1/progs/suit.mdl": `${assetsUrl}/progs/suit.mdl`,
      "id1/progs/v_axe.mdl": `${assetsUrl}/progs/v_axe.mdl`,
      "id1/progs/v_light.mdl": `${assetsUrl}/progs/v_light.mdl`,
      "id1/progs/v_nail2.mdl": `${assetsUrl}/progs/v_nail2.mdl`,
      "id1/progs/v_nail.mdl": `${assetsUrl}/progs/v_nail.mdl`,
      "id1/progs/v_rock2.mdl": `${assetsUrl}/progs/v_rock2.mdl`,
      "id1/progs/v_rock.mdl": `${assetsUrl}/progs/v_rock.mdl`,
      "id1/progs/v_shot1.mdl": `${assetsUrl}/progs/v_shot1.mdl`,
      "id1/progs/v_shot2.mdl": `${assetsUrl}/progs/v_shot2.mdl`,
      "id1/progs/v_shot.mdl": `${assetsUrl}/progs/v_shot.mdl`,
      "id1/progs/v_star.mdl": `${assetsUrl}/progs/v_star.mdl`,
      "id1/scripts/shell.shader": `${assetsUrl}/scripts/shell.shader`,
      "id1/skins/blue.png": `${assetsUrl}/skins/blue.png`,
      "id1/skins/red.png": `${assetsUrl}/skins/red.png`,
      "id1/sound/ambience/buzz1.wav": `${assetsUrl}/sound/ambience/buzz1.wav`,
      "id1/sound/ambience/comp1.wav": `${assetsUrl}/sound/ambience/comp1.wav`,
      "id1/sound/ambience/drip1.wav": `${assetsUrl}/sound/ambience/drip1.wav`,
      "id1/sound/ambience/drone6.wav": `${assetsUrl}/sound/ambience/drone6.wav`,
      "id1/sound/ambience/fire1.wav": `${assetsUrl}/sound/ambience/fire1.wav`,
      "id1/sound/ambience/fl_hum1.wav": `${assetsUrl}/sound/ambience/fl_hum1.wav`,
      "id1/sound/ambience/hum1.wav": `${assetsUrl}/sound/ambience/hum1.wav`,
      "id1/sound/ambience/suck1.wav": `${assetsUrl}/sound/ambience/suck1.wav`,
      "id1/sound/ambience/swamp1.wav": `${assetsUrl}/sound/ambience/swamp1.wav`,
      "id1/sound/ambience/swamp2.wav": `${assetsUrl}/sound/ambience/swamp2.wav`,
      "id1/sound/ambience/thunder1.wav": `${assetsUrl}/sound/ambience/thunder1.wav`,
      "id1/sound/ambience/water1.wav": `${assetsUrl}/sound/ambience/water1.wav`,
      "id1/sound/ambience/wind2.wav": `${assetsUrl}/sound/ambience/wind2.wav`,
      "id1/sound/ambience/windfly.wav": `${assetsUrl}/sound/ambience/windfly.wav`,
      "id1/sound/buttons/airbut1.wav": `${assetsUrl}/sound/buttons/airbut1.wav`,
      "id1/sound/buttons/switch02.wav": `${assetsUrl}/sound/buttons/switch02.wav`,
      "id1/sound/buttons/switch04.wav": `${assetsUrl}/sound/buttons/switch04.wav`,
      "id1/sound/buttons/switch21.wav": `${assetsUrl}/sound/buttons/switch21.wav`,
      "id1/sound/doors/airdoor1.wav": `${assetsUrl}/sound/doors/airdoor1.wav`,
      "id1/sound/doors/airdoor2.wav": `${assetsUrl}/sound/doors/airdoor2.wav`,
      "id1/sound/doors/basesec1.wav": `${assetsUrl}/sound/doors/basesec1.wav`,
      "id1/sound/doors/basesec2.wav": `${assetsUrl}/sound/doors/basesec2.wav`,
      "id1/sound/doors/basetry.wav": `${assetsUrl}/sound/doors/basetry.wav`,
      "id1/sound/doors/baseuse.wav": `${assetsUrl}/sound/doors/baseuse.wav`,
      "id1/sound/doors/ddoor1.wav": `${assetsUrl}/sound/doors/ddoor1.wav`,
      "id1/sound/doors/ddoor2.wav": `${assetsUrl}/sound/doors/ddoor2.wav`,
      "id1/sound/doors/doormv1.wav": `${assetsUrl}/sound/doors/doormv1.wav`,
      "id1/sound/doors/drclos4.wav": `${assetsUrl}/sound/doors/drclos4.wav`,
      "id1/sound/doors/hydro1.wav": `${assetsUrl}/sound/doors/hydro1.wav`,
      "id1/sound/doors/hydro2.wav": `${assetsUrl}/sound/doors/hydro2.wav`,
      "id1/sound/doors/latch2.wav": `${assetsUrl}/sound/doors/latch2.wav`,
      "id1/sound/doors/medtry.wav": `${assetsUrl}/sound/doors/medtry.wav`,
      "id1/sound/doors/meduse.wav": `${assetsUrl}/sound/doors/meduse.wav`,
      "id1/sound/doors/runetry.wav": `${assetsUrl}/sound/doors/runetry.wav`,
      "id1/sound/doors/runeuse.wav": `${assetsUrl}/sound/doors/runeuse.wav`,
      "id1/sound/doors/stndr1.wav": `${assetsUrl}/sound/doors/stndr1.wav`,
      "id1/sound/doors/stndr2.wav": `${assetsUrl}/sound/doors/stndr2.wav`,
      "id1/sound/doors/winch2.wav": `${assetsUrl}/sound/doors/winch2.wav`,
      "id1/sound/items/armor1.wav": `${assetsUrl}/sound/items/armor1.wav`,
      "id1/sound/items/damage2.wav": `${assetsUrl}/sound/items/damage2.wav`,
      "id1/sound/items/damage3.wav": `${assetsUrl}/sound/items/damage3.wav`,
      "id1/sound/items/damage.wav": `${assetsUrl}/sound/items/damage.wav`,
      "id1/sound/items/health1.wav": `${assetsUrl}/sound/items/health1.wav`,
      "id1/sound/items/inv1.wav": `${assetsUrl}/sound/items/inv1.wav`,
      "id1/sound/items/inv2.wav": `${assetsUrl}/sound/items/inv2.wav`,
      "id1/sound/items/inv3.wav": `${assetsUrl}/sound/items/inv3.wav`,
      "id1/sound/items/itembk2.wav": `${assetsUrl}/sound/items/itembk2.wav`,
      "id1/sound/items/protect2.wav": `${assetsUrl}/sound/items/protect2.wav`,
      "id1/sound/items/protect3.wav": `${assetsUrl}/sound/items/protect3.wav`,
      "id1/sound/items/protect.wav": `${assetsUrl}/sound/items/protect.wav`,
      "id1/sound/items/r_item1.wav": `${assetsUrl}/sound/items/r_item1.wav`,
      "id1/sound/items/r_item2.wav": `${assetsUrl}/sound/items/r_item2.wav`,
      "id1/sound/items/suit2.wav": `${assetsUrl}/sound/items/suit2.wav`,
      "id1/sound/items/suit.wav": `${assetsUrl}/sound/items/suit.wav`,
      "id1/sound/misc/flagcap.wav": `${assetsUrl}/sound/misc/flagcap.wav`,
      "id1/sound/misc/flagtk.wav": `${assetsUrl}/sound/misc/flagtk.wav`,
      "id1/sound/misc/h2ohit1.wav": `${assetsUrl}/sound/misc/h2ohit1.wav`,
      "id1/sound/misc/medkey.wav": `${assetsUrl}/sound/misc/medkey.wav`,
      "id1/sound/misc/menu1.wav": `${assetsUrl}/sound/misc/menu1.wav`,
      "id1/sound/misc/menu2.wav": `${assetsUrl}/sound/misc/menu2.wav`,
      "id1/sound/misc/menu3.wav": `${assetsUrl}/sound/misc/menu3.wav`,
      "id1/sound/misc/null.wav": `${assetsUrl}/sound/misc/null.wav`,
      "id1/sound/misc/outwater.wav": `${assetsUrl}/sound/misc/outwater.wav`,
      "id1/sound/misc/power.wav": `${assetsUrl}/sound/misc/power.wav`,
      "id1/sound/misc/r_tele1.wav": `${assetsUrl}/sound/misc/r_tele1.wav`,
      "id1/sound/misc/r_tele2.wav": `${assetsUrl}/sound/misc/r_tele2.wav`,
      "id1/sound/misc/r_tele3.wav": `${assetsUrl}/sound/misc/r_tele3.wav`,
      "id1/sound/misc/r_tele4.wav": `${assetsUrl}/sound/misc/r_tele4.wav`,
      "id1/sound/misc/r_tele5.wav": `${assetsUrl}/sound/misc/r_tele5.wav`,
      "id1/sound/misc/runekey.wav": `${assetsUrl}/sound/misc/runekey.wav`,
      "id1/sound/misc/secret.wav": `${assetsUrl}/sound/misc/secret.wav`,
      "id1/sound/misc/talk.wav": `${assetsUrl}/sound/misc/talk.wav`,
      "id1/sound/misc/trigger1.wav": `${assetsUrl}/sound/misc/trigger1.wav`,
      "id1/sound/misc/water1.wav": `${assetsUrl}/sound/misc/water1.wav`,
      "id1/sound/misc/water2.wav": `${assetsUrl}/sound/misc/water2.wav`,
      "id1/sound/plats/medplat1.wav": `${assetsUrl}/sound/plats/medplat1.wav`,
      "id1/sound/plats/medplat2.wav": `${assetsUrl}/sound/plats/medplat2.wav`,
      "id1/sound/plats/plat1.wav": `${assetsUrl}/sound/plats/plat1.wav`,
      "id1/sound/plats/plat2.wav": `${assetsUrl}/sound/plats/plat2.wav`,
      "id1/sound/plats/train1.wav": `${assetsUrl}/sound/plats/train1.wav`,
      "id1/sound/plats/train2.wav": `${assetsUrl}/sound/plats/train2.wav`,
      "id1/sound/player/axhit1.wav": `${assetsUrl}/sound/player/axhit1.wav`,
      "id1/sound/player/axhit2.wav": `${assetsUrl}/sound/player/axhit2.wav`,
      "id1/sound/player/death1.wav": `${assetsUrl}/sound/player/death1.wav`,
      "id1/sound/player/death2.wav": `${assetsUrl}/sound/player/death2.wav`,
      "id1/sound/player/death3.wav": `${assetsUrl}/sound/player/death3.wav`,
      "id1/sound/player/death4.wav": `${assetsUrl}/sound/player/death4.wav`,
      "id1/sound/player/death5.wav": `${assetsUrl}/sound/player/death5.wav`,
      "id1/sound/player/drown1.wav": `${assetsUrl}/sound/player/drown1.wav`,
      "id1/sound/player/drown2.wav": `${assetsUrl}/sound/player/drown2.wav`,
      "id1/sound/player/gasp1.wav": `${assetsUrl}/sound/player/gasp1.wav`,
      "id1/sound/player/gasp2.wav": `${assetsUrl}/sound/player/gasp2.wav`,
      "id1/sound/player/gib.wav": `${assetsUrl}/sound/player/gib.wav`,
      "id1/sound/player/h2odeath.wav": `${assetsUrl}/sound/player/h2odeath.wav`,
      "id1/sound/player/h2ojump.wav": `${assetsUrl}/sound/player/h2ojump.wav`,
      "id1/sound/player/inh2o.wav": `${assetsUrl}/sound/player/inh2o.wav`,
      "id1/sound/player/inlava.wav": `${assetsUrl}/sound/player/inlava.wav`,
      "id1/sound/player/land2.wav": `${assetsUrl}/sound/player/land2.wav`,
      "id1/sound/player/land.wav": `${assetsUrl}/sound/player/land.wav`,
      "id1/sound/player/lburn1.wav": `${assetsUrl}/sound/player/lburn1.wav`,
      "id1/sound/player/lburn2.wav": `${assetsUrl}/sound/player/lburn2.wav`,
      "id1/sound/player/pain1.wav": `${assetsUrl}/sound/player/pain1.wav`,
      "id1/sound/player/pain2.wav": `${assetsUrl}/sound/player/pain2.wav`,
      "id1/sound/player/pain3.wav": `${assetsUrl}/sound/player/pain3.wav`,
      "id1/sound/player/pain4.wav": `${assetsUrl}/sound/player/pain4.wav`,
      "id1/sound/player/pain5.wav": `${assetsUrl}/sound/player/pain5.wav`,
      "id1/sound/player/pain6.wav": `${assetsUrl}/sound/player/pain6.wav`,
      "id1/sound/player/plyrjmp8.wav": `${assetsUrl}/sound/player/plyrjmp8.wav`,
      "id1/sound/player/slimbrn2.wav": `${assetsUrl}/sound/player/slimbrn2.wav`,
      "id1/sound/player/teledth1.wav": `${assetsUrl}/sound/player/teledth1.wav`,
      "id1/sound/player/tornoff2.wav": `${assetsUrl}/sound/player/tornoff2.wav`,
      "id1/sound/player/udeath.wav": `${assetsUrl}/sound/player/udeath.wav`,
      "id1/sound/ra/1.wav": `${assetsUrl}/sound/ra/1.wav`,
      "id1/sound/ra/2.wav": `${assetsUrl}/sound/ra/2.wav`,
      "id1/sound/ra/3.wav": `${assetsUrl}/sound/ra/3.wav`,
      "id1/sound/ra/fight.wav": `${assetsUrl}/sound/ra/fight.wav`,
      "id1/sound/rune/rune1.wav": `${assetsUrl}/sound/rune/rune1.wav`,
      "id1/sound/rune/rune22.wav": `${assetsUrl}/sound/rune/rune22.wav`,
      "id1/sound/rune/rune2.wav": `${assetsUrl}/sound/rune/rune2.wav`,
      "id1/sound/rune/rune3.wav": `${assetsUrl}/sound/rune/rune3.wav`,
      "id1/sound/rune/rune4.wav": `${assetsUrl}/sound/rune/rune4.wav`,
      "id1/sound/weapons/ax1.wav": `${assetsUrl}/sound/weapons/ax1.wav`,
      "id1/sound/weapons/bounce2.wav": `${assetsUrl}/sound/weapons/bounce2.wav`,
      "id1/sound/weapons/bounce.wav": `${assetsUrl}/sound/weapons/bounce.wav`,
      "id1/sound/weapons/chain1.wav": `${assetsUrl}/sound/weapons/chain1.wav`,
      "id1/sound/weapons/chain2.wav": `${assetsUrl}/sound/weapons/chain2.wav`,
      "id1/sound/weapons/chain3.wav": `${assetsUrl}/sound/weapons/chain3.wav`,
      "id1/sound/weapons/grenade.wav": `${assetsUrl}/sound/weapons/grenade.wav`,
      "id1/sound/weapons/guncock.wav": `${assetsUrl}/sound/weapons/guncock.wav`,
      "id1/sound/weapons/lhit.wav": `${assetsUrl}/sound/weapons/lhit.wav`,
      "id1/sound/weapons/lock4.wav": `${assetsUrl}/sound/weapons/lock4.wav`,
      "id1/sound/weapons/lstart.wav": `${assetsUrl}/sound/weapons/lstart.wav`,
      "id1/sound/weapons/pkup.wav": `${assetsUrl}/sound/weapons/pkup.wav`,
      "id1/sound/weapons/r_exp3.wav": `${assetsUrl}/sound/weapons/r_exp3.wav`,
      "id1/sound/weapons/ric1.wav": `${assetsUrl}/sound/weapons/ric1.wav`,
      "id1/sound/weapons/ric2.wav": `${assetsUrl}/sound/weapons/ric2.wav`,
      "id1/sound/weapons/ric3.wav": `${assetsUrl}/sound/weapons/ric3.wav`,
      "id1/sound/weapons/rocket1i.wav": `${assetsUrl}/sound/weapons/rocket1i.wav`,
      "id1/sound/weapons/sgun1.wav": `${assetsUrl}/sound/weapons/sgun1.wav`,
      "id1/sound/weapons/shotgn2.wav": `${assetsUrl}/sound/weapons/shotgn2.wav`,
      "id1/sound/weapons/spike2.wav": `${assetsUrl}/sound/weapons/spike2.wav`,
      "id1/sound/weapons/tink1.wav": `${assetsUrl}/sound/weapons/tink1.wav`,
      "id1/textures/bmodels/+0_med100.png": `${assetsUrl}/textures/bmodels/+0_med100.png`,
      "id1/textures/bmodels/+0_med25_luma.png": `${assetsUrl}/textures/bmodels/+0_med25_luma.png`,
      "id1/textures/bmodels/+0_med25.png": `${assetsUrl}/textures/bmodels/+0_med25.png`,
      "id1/textures/bmodels/+0_med25s.png": `${assetsUrl}/textures/bmodels/+0_med25s.png`,
      "id1/textures/bmodels/+1_med100.png": `${assetsUrl}/textures/bmodels/+1_med100.png`,
      "id1/textures/bmodels/+1_med25_luma.png": `${assetsUrl}/textures/bmodels/+1_med25_luma.png`,
      "id1/textures/bmodels/+1_med25.png": `${assetsUrl}/textures/bmodels/+1_med25.png`,
      "id1/textures/bmodels/+1_med25s.png": `${assetsUrl}/textures/bmodels/+1_med25s.png`,
      "id1/textures/bmodels/+2_med100.png": `${assetsUrl}/textures/bmodels/+2_med100.png`,
      "id1/textures/bmodels/+2_med25_luma.png": `${assetsUrl}/textures/bmodels/+2_med25_luma.png`,
      "id1/textures/bmodels/+2_med25.png": `${assetsUrl}/textures/bmodels/+2_med25.png`,
      "id1/textures/bmodels/+2_med25s.png": `${assetsUrl}/textures/bmodels/+2_med25s.png`,
      "id1/textures/bmodels/+3_med100.png": `${assetsUrl}/textures/bmodels/+3_med100.png`,
      "id1/textures/bmodels/+3_med25_luma.png": `${assetsUrl}/textures/bmodels/+3_med25_luma.png`,
      "id1/textures/bmodels/+3_med25.png": `${assetsUrl}/textures/bmodels/+3_med25.png`,
      "id1/textures/bmodels/+3_med25s.png": `${assetsUrl}/textures/bmodels/+3_med25s.png`,
      "id1/textures/bmodels/batt0sid.png": `${assetsUrl}/textures/bmodels/batt0sid.png`,
      "id1/textures/bmodels/batt0top.png": `${assetsUrl}/textures/bmodels/batt0top.png`,
      "id1/textures/bmodels/batt1sid.png": `${assetsUrl}/textures/bmodels/batt1sid.png`,
      "id1/textures/bmodels/batt1top.png": `${assetsUrl}/textures/bmodels/batt1top.png`,
      "id1/textures/bmodels/med100.png": `${assetsUrl}/textures/bmodels/med100.png`,
      "id1/textures/bmodels/med3_0_luma.png": `${assetsUrl}/textures/bmodels/med3_0_luma.png`,
      "id1/textures/bmodels/med3_0.png": `${assetsUrl}/textures/bmodels/med3_0.png`,
      "id1/textures/bmodels/med3_1.png": `${assetsUrl}/textures/bmodels/med3_1.png`,
      "id1/textures/bmodels/nail0sid.png": `${assetsUrl}/textures/bmodels/nail0sid.png`,
      "id1/textures/bmodels/nail0top.png": `${assetsUrl}/textures/bmodels/nail0top.png`,
      "id1/textures/bmodels/nail1sid.png": `${assetsUrl}/textures/bmodels/nail1sid.png`,
      "id1/textures/bmodels/nail1top_luma.png": `${assetsUrl}/textures/bmodels/nail1top_luma.png`,
      "id1/textures/bmodels/nail1top.png": `${assetsUrl}/textures/bmodels/nail1top.png`,
      "id1/textures/bmodels/rock0sid.png": `${assetsUrl}/textures/bmodels/rock0sid.png`,
      "id1/textures/bmodels/rock1sid.png": `${assetsUrl}/textures/bmodels/rock1sid.png`,
      "id1/textures/bmodels/rockettop.png": `${assetsUrl}/textures/bmodels/rockettop.png`,
      "id1/textures/bmodels/shot0sid.png": `${assetsUrl}/textures/bmodels/shot0sid.png`,
      "id1/textures/bmodels/shot0top.png": `${assetsUrl}/textures/bmodels/shot0top.png`,
      "id1/textures/bmodels/shot1sid.png": `${assetsUrl}/textures/bmodels/shot1sid.png`,
      "id1/textures/bmodels/shot1top_luma.png": `${assetsUrl}/textures/bmodels/shot1top_luma.png`,
      "id1/textures/bmodels/shot1top.png": `${assetsUrl}/textures/bmodels/shot1top.png`,
      "id1/textures/charsets/graybugs.png": `${assetsUrl}/textures/charsets/graybugs.png`,
      "id1/textures/grenade_glow.png": `${assetsUrl}/textures/grenade_glow.png`,
      "id1/textures/grenade.png": `${assetsUrl}/textures/grenade.png`,
      "id1/textures/#lava1_luma.png": `${assetsUrl}/textures/#lava1_luma.png`,
      "id1/textures/#lava1.png": `${assetsUrl}/textures/#lava1.png`,
      "id1/textures/missile_glow.png": `${assetsUrl}/textures/missile_glow.png`,
      "id1/textures/missile.png": `${assetsUrl}/textures/missile.png`,
      "id1/textures/models/armor.mdl_0.png": `${assetsUrl}/textures/models/armor.mdl_0.png`,
      "id1/textures/models/armor.mdl_1.png": `${assetsUrl}/textures/models/armor.mdl_1.png`,
      "id1/textures/models/armor.mdl_2.png": `${assetsUrl}/textures/models/armor.mdl_2.png`,
      "id1/textures/models/backpack.mdl_0.png": `${assetsUrl}/textures/models/backpack.mdl_0.png`,
      "id1/textures/models/end1.mdl_0.png": `${assetsUrl}/textures/models/end1.mdl_0.png`,
      "id1/textures/models/end2.mdl_0.png": `${assetsUrl}/textures/models/end2.mdl_0.png`,
      "id1/textures/models/end3.mdl_0.png": `${assetsUrl}/textures/models/end3.mdl_0.png`,
      "id1/textures/models/end4.mdl_0.png": `${assetsUrl}/textures/models/end4.mdl_0.png`,
      "id1/textures/models/flag.mdl_0.png": `${assetsUrl}/textures/models/flag.mdl_0.png`,
      "id1/textures/models/flag.mdl_1.png": `${assetsUrl}/textures/models/flag.mdl_1.png`,
      "id1/textures/models/gib1.mdl_0.png": `${assetsUrl}/textures/models/gib1.mdl_0.png`,
      "id1/textures/models/gib2.mdl_0.png": `${assetsUrl}/textures/models/gib2.mdl_0.png`,
      "id1/textures/models/h_player.mdl_0.png": `${assetsUrl}/textures/models/h_player.mdl_0.png`,
      "id1/textures/models/v_axe.mdl_0.png": `${assetsUrl}/textures/models/v_axe.mdl_0.png`,
      "id1/textures/particles/bubble.png": `${assetsUrl}/textures/particles/bubble.png`,
      "id1/textures/particles/flame.png": `${assetsUrl}/textures/particles/flame.png`,
      "id1/textures/particles/generic.png": `${assetsUrl}/textures/particles/generic.png`,
      "id1/textures/particles/rfire.png": `${assetsUrl}/textures/particles/rfire.png`,
      "id1/textures/particles/smoke.png": `${assetsUrl}/textures/particles/smoke.png`,
      "id1/textures/particles/v_rock2_flash.png": `${assetsUrl}/textures/particles/v_rock2_flash.png`,
      "id1/textures/particles/v_shot2_flash.png": `${assetsUrl}/textures/particles/v_shot2_flash.png`,
      "id1/textures/sfx/quad.png": `${assetsUrl}/textures/sfx/quad.png`,
      "id1/textures/#teleport.png": `${assetsUrl}/textures/#teleport.png`,
      "id1/textures/tracker/axe.png": `${assetsUrl}/textures/tracker/axe.png`,
      "id1/textures/tracker/coil.png": `${assetsUrl}/textures/tracker/coil.png`,
      "id1/textures/tracker/discharge.png": `${assetsUrl}/textures/tracker/discharge.png`,
      "id1/textures/tracker/drown.png": `${assetsUrl}/textures/tracker/drown.png`,
      "id1/textures/tracker/fall.png": `${assetsUrl}/textures/tracker/fall.png`,
      "id1/textures/tracker/gl.png": `${assetsUrl}/textures/tracker/gl.png`,
      "id1/textures/tracker/lava.png": `${assetsUrl}/textures/tracker/lava.png`,
      "id1/textures/tracker/lg.png": `${assetsUrl}/textures/tracker/lg.png`,
      "id1/textures/tracker/ng.png": `${assetsUrl}/textures/tracker/ng.png`,
      "id1/textures/tracker/q.png": `${assetsUrl}/textures/tracker/q.png`,
      "id1/textures/tracker/rail.png": `${assetsUrl}/textures/tracker/rail.png`,
      "id1/textures/tracker/rl.png": `${assetsUrl}/textures/tracker/rl.png`,
      "id1/textures/tracker/sg.png": `${assetsUrl}/textures/tracker/sg.png`,
      "id1/textures/tracker/slime.png": `${assetsUrl}/textures/tracker/slime.png`,
      "id1/textures/tracker/sng.png": `${assetsUrl}/textures/tracker/sng.png`,
      "id1/textures/tracker/squish.png": `${assetsUrl}/textures/tracker/squish.png`,
      "id1/textures/tracker/ssg.png": `${assetsUrl}/textures/tracker/ssg.png`,
      "id1/textures/tracker/stomp.png": `${assetsUrl}/textures/tracker/stomp.png`,
      "id1/textures/tracker/tele.png": `${assetsUrl}/textures/tracker/tele.png`,
      "id1/textures/tracker/tkills.png": `${assetsUrl}/textures/tracker/tkills.png`,
      "id1/textures/tracker/trap.png": `${assetsUrl}/textures/tracker/trap.png`,
      "id1/textures/wad/anum_0.png": `${assetsUrl}/textures/wad/anum_0.png`,
      "id1/textures/wad/anum_1.png": `${assetsUrl}/textures/wad/anum_1.png`,
      "id1/textures/wad/anum_2.png": `${assetsUrl}/textures/wad/anum_2.png`,
      "id1/textures/wad/anum_3.png": `${assetsUrl}/textures/wad/anum_3.png`,
      "id1/textures/wad/anum_4.png": `${assetsUrl}/textures/wad/anum_4.png`,
      "id1/textures/wad/anum_5.png": `${assetsUrl}/textures/wad/anum_5.png`,
      "id1/textures/wad/anum_6.png": `${assetsUrl}/textures/wad/anum_6.png`,
      "id1/textures/wad/anum_7.png": `${assetsUrl}/textures/wad/anum_7.png`,
      "id1/textures/wad/anum_8.png": `${assetsUrl}/textures/wad/anum_8.png`,
      "id1/textures/wad/anum_9.png": `${assetsUrl}/textures/wad/anum_9.png`,
      "id1/textures/wad/anum_colon.png": `${assetsUrl}/textures/wad/anum_colon.png`,
      "id1/textures/wad/anum_minus.png": `${assetsUrl}/textures/wad/anum_minus.png`,
      "id1/textures/wad/face1.png": `${assetsUrl}/textures/wad/face1.png`,
      "id1/textures/wad/face2.png": `${assetsUrl}/textures/wad/face2.png`,
      "id1/textures/wad/face3.png": `${assetsUrl}/textures/wad/face3.png`,
      "id1/textures/wad/face4.png": `${assetsUrl}/textures/wad/face4.png`,
      "id1/textures/wad/face5.png": `${assetsUrl}/textures/wad/face5.png`,
      "id1/textures/wad/face_inv2.png": `${assetsUrl}/textures/wad/face_inv2.png`,
      "id1/textures/wad/face_invis.png": `${assetsUrl}/textures/wad/face_invis.png`,
      "id1/textures/wad/face_invul1.png": `${assetsUrl}/textures/wad/face_invul1.png`,
      "id1/textures/wad/face_invul2.png": `${assetsUrl}/textures/wad/face_invul2.png`,
      "id1/textures/wad/face_p1.png": `${assetsUrl}/textures/wad/face_p1.png`,
      "id1/textures/wad/face_p2.png": `${assetsUrl}/textures/wad/face_p2.png`,
      "id1/textures/wad/face_p3.png": `${assetsUrl}/textures/wad/face_p3.png`,
      "id1/textures/wad/face_p4.png": `${assetsUrl}/textures/wad/face_p4.png`,
      "id1/textures/wad/face_p5.png": `${assetsUrl}/textures/wad/face_p5.png`,
      "id1/textures/wad/face_quad.png": `${assetsUrl}/textures/wad/face_quad.png`,
      "id1/textures/wad/ibar.png": `${assetsUrl}/textures/wad/ibar.png`,
      "id1/textures/wad/inv2_lightng.png": `${assetsUrl}/textures/wad/inv2_lightng.png`,
      "id1/textures/wad/inv2_nailgun.png": `${assetsUrl}/textures/wad/inv2_nailgun.png`,
      "id1/textures/wad/inv2_rlaunch.png": `${assetsUrl}/textures/wad/inv2_rlaunch.png`,
      "id1/textures/wad/inv2_shotgun.png": `${assetsUrl}/textures/wad/inv2_shotgun.png`,
      "id1/textures/wad/inv2_snailgun.png": `${assetsUrl}/textures/wad/inv2_snailgun.png`,
      "id1/textures/wad/inv2_srlaunch.png": `${assetsUrl}/textures/wad/inv2_srlaunch.png`,
      "id1/textures/wad/inv2_sshotgun.png": `${assetsUrl}/textures/wad/inv2_sshotgun.png`,
      "id1/textures/wad/inva1_lightng.png": `${assetsUrl}/textures/wad/inva1_lightng.png`,
      "id1/textures/wad/inva1_nailgun.png": `${assetsUrl}/textures/wad/inva1_nailgun.png`,
      "id1/textures/wad/inva1_rlaunch.png": `${assetsUrl}/textures/wad/inva1_rlaunch.png`,
      "id1/textures/wad/inva1_shotgun.png": `${assetsUrl}/textures/wad/inva1_shotgun.png`,
      "id1/textures/wad/inva1_snailgun.png": `${assetsUrl}/textures/wad/inva1_snailgun.png`,
      "id1/textures/wad/inva1_srlaunch.png": `${assetsUrl}/textures/wad/inva1_srlaunch.png`,
      "id1/textures/wad/inva1_sshotgun.png": `${assetsUrl}/textures/wad/inva1_sshotgun.png`,
      "id1/textures/wad/inva2_lightng.png": `${assetsUrl}/textures/wad/inva2_lightng.png`,
      "id1/textures/wad/inva2_nailgun.png": `${assetsUrl}/textures/wad/inva2_nailgun.png`,
      "id1/textures/wad/inva2_rlaunch.png": `${assetsUrl}/textures/wad/inva2_rlaunch.png`,
      "id1/textures/wad/inva2_shotgun.png": `${assetsUrl}/textures/wad/inva2_shotgun.png`,
      "id1/textures/wad/inva2_snailgun.png": `${assetsUrl}/textures/wad/inva2_snailgun.png`,
      "id1/textures/wad/inva2_srlaunch.png": `${assetsUrl}/textures/wad/inva2_srlaunch.png`,
      "id1/textures/wad/inva2_sshotgun.png": `${assetsUrl}/textures/wad/inva2_sshotgun.png`,
      "id1/textures/wad/inva3_lightng.png": `${assetsUrl}/textures/wad/inva3_lightng.png`,
      "id1/textures/wad/inva3_nailgun.png": `${assetsUrl}/textures/wad/inva3_nailgun.png`,
      "id1/textures/wad/inva3_rlaunch.png": `${assetsUrl}/textures/wad/inva3_rlaunch.png`,
      "id1/textures/wad/inva3_shotgun.png": `${assetsUrl}/textures/wad/inva3_shotgun.png`,
      "id1/textures/wad/inva3_snailgun.png": `${assetsUrl}/textures/wad/inva3_snailgun.png`,
      "id1/textures/wad/inva3_srlaunch.png": `${assetsUrl}/textures/wad/inva3_srlaunch.png`,
      "id1/textures/wad/inva3_sshotgun.png": `${assetsUrl}/textures/wad/inva3_sshotgun.png`,
      "id1/textures/wad/inva4_lightng.png": `${assetsUrl}/textures/wad/inva4_lightng.png`,
      "id1/textures/wad/inva4_nailgun.png": `${assetsUrl}/textures/wad/inva4_nailgun.png`,
      "id1/textures/wad/inva4_rlaunch.png": `${assetsUrl}/textures/wad/inva4_rlaunch.png`,
      "id1/textures/wad/inva4_shotgun.png": `${assetsUrl}/textures/wad/inva4_shotgun.png`,
      "id1/textures/wad/inva4_snailgun.png": `${assetsUrl}/textures/wad/inva4_snailgun.png`,
      "id1/textures/wad/inva4_srlaunch.png": `${assetsUrl}/textures/wad/inva4_srlaunch.png`,
      "id1/textures/wad/inva4_sshotgun.png": `${assetsUrl}/textures/wad/inva4_sshotgun.png`,
      "id1/textures/wad/inva5_lightng.png": `${assetsUrl}/textures/wad/inva5_lightng.png`,
      "id1/textures/wad/inva5_nailgun.png": `${assetsUrl}/textures/wad/inva5_nailgun.png`,
      "id1/textures/wad/inva5_rlaunch.png": `${assetsUrl}/textures/wad/inva5_rlaunch.png`,
      "id1/textures/wad/inva5_shotgun.png": `${assetsUrl}/textures/wad/inva5_shotgun.png`,
      "id1/textures/wad/inva5_snailgun.png": `${assetsUrl}/textures/wad/inva5_snailgun.png`,
      "id1/textures/wad/inva5_srlaunch.png": `${assetsUrl}/textures/wad/inva5_srlaunch.png`,
      "id1/textures/wad/inva5_sshotgun.png": `${assetsUrl}/textures/wad/inva5_sshotgun.png`,
      "id1/textures/wad/inv_lightng.png": `${assetsUrl}/textures/wad/inv_lightng.png`,
      "id1/textures/wad/inv_nailgun.png": `${assetsUrl}/textures/wad/inv_nailgun.png`,
      "id1/textures/wad/inv_nails.png": `${assetsUrl}/textures/wad/inv_nails.png`,
      "id1/textures/wad/inv_rlaunch.png": `${assetsUrl}/textures/wad/inv_rlaunch.png`,
      "id1/textures/wad/inv_rocket.png": `${assetsUrl}/textures/wad/inv_rocket.png`,
      "id1/textures/wad/inv_shells.png": `${assetsUrl}/textures/wad/inv_shells.png`,
      "id1/textures/wad/inv_shotgun.png": `${assetsUrl}/textures/wad/inv_shotgun.png`,
      "id1/textures/wad/inv_snailgun.png": `${assetsUrl}/textures/wad/inv_snailgun.png`,
      "id1/textures/wad/inv_srlaunch.png": `${assetsUrl}/textures/wad/inv_srlaunch.png`,
      "id1/textures/wad/inv_sshotgun.png": `${assetsUrl}/textures/wad/inv_sshotgun.png`,
      "id1/textures/wad/num_0.png": `${assetsUrl}/textures/wad/num_0.png`,
      "id1/textures/wad/num_1.png": `${assetsUrl}/textures/wad/num_1.png`,
      "id1/textures/wad/num_2.png": `${assetsUrl}/textures/wad/num_2.png`,
      "id1/textures/wad/num_3.png": `${assetsUrl}/textures/wad/num_3.png`,
      "id1/textures/wad/num_4.png": `${assetsUrl}/textures/wad/num_4.png`,
      "id1/textures/wad/num_5.png": `${assetsUrl}/textures/wad/num_5.png`,
      "id1/textures/wad/num_6.png": `${assetsUrl}/textures/wad/num_6.png`,
      "id1/textures/wad/num_7.png": `${assetsUrl}/textures/wad/num_7.png`,
      "id1/textures/wad/num_8.png": `${assetsUrl}/textures/wad/num_8.png`,
      "id1/textures/wad/num_9.png": `${assetsUrl}/textures/wad/num_9.png`,
      "id1/textures/wad/num_colon.png": `${assetsUrl}/textures/wad/num_colon.png`,
      "id1/textures/wad/num_minus.png": `${assetsUrl}/textures/wad/num_minus.png`,
      "id1/textures/wad/sba1_key1.png": `${assetsUrl}/textures/wad/sba1_key1.png`,
      "id1/textures/wad/sba1_key2.png": `${assetsUrl}/textures/wad/sba1_key2.png`,
      "id1/textures/wad/sba2_key1.png": `${assetsUrl}/textures/wad/sba2_key1.png`,
      "id1/textures/wad/sba2_key2.png": `${assetsUrl}/textures/wad/sba2_key2.png`,
      "id1/textures/wad/sba3_key1.png": `${assetsUrl}/textures/wad/sba3_key1.png`,
      "id1/textures/wad/sba3_key2.png": `${assetsUrl}/textures/wad/sba3_key2.png`,
      "id1/textures/wad/sba4_key1.png": `${assetsUrl}/textures/wad/sba4_key1.png`,
      "id1/textures/wad/sba4_key2.png": `${assetsUrl}/textures/wad/sba4_key2.png`,
      "id1/textures/wad/sba5_key1.png": `${assetsUrl}/textures/wad/sba5_key1.png`,
      "id1/textures/wad/sba5_key2.png": `${assetsUrl}/textures/wad/sba5_key2.png`,
      "id1/textures/wad/sb_armor1.png": `${assetsUrl}/textures/wad/sb_armor1.png`,
      "id1/textures/wad/sb_armor2.png": `${assetsUrl}/textures/wad/sb_armor2.png`,
      "id1/textures/wad/sb_armor3.png": `${assetsUrl}/textures/wad/sb_armor3.png`,
      "id1/textures/wad/sb_cells.png": `${assetsUrl}/textures/wad/sb_cells.png`,
      "id1/textures/wad/sb_invis.png": `${assetsUrl}/textures/wad/sb_invis.png`,
      "id1/textures/wad/sb_invuln.png": `${assetsUrl}/textures/wad/sb_invuln.png`,
      "id1/textures/wad/sb_key1.png": `${assetsUrl}/textures/wad/sb_key1.png`,
      "id1/textures/wad/sb_key2.png": `${assetsUrl}/textures/wad/sb_key2.png`,
      "id1/textures/wad/sb_nails.png": `${assetsUrl}/textures/wad/sb_nails.png`,
      "id1/textures/wad/sb_quad.png": `${assetsUrl}/textures/wad/sb_quad.png`,
      "id1/textures/wad/sb_rocket.png": `${assetsUrl}/textures/wad/sb_rocket.png`,
      "id1/textures/wad/sb_shells.png": `${assetsUrl}/textures/wad/sb_shells.png`,
      "id1/textures/wad/sb_sigil1.png": `${assetsUrl}/textures/wad/sb_sigil1.png`,
      "id1/textures/wad/sb_sigil2.png": `${assetsUrl}/textures/wad/sb_sigil2.png`,
      "id1/textures/wad/sb_sigil3.png": `${assetsUrl}/textures/wad/sb_sigil3.png`,
      "id1/textures/wad/sb_sigil4.png": `${assetsUrl}/textures/wad/sb_sigil4.png`,
      "id1/textures/wad/sb_suit.png": `${assetsUrl}/textures/wad/sb_suit.png`,
      "qw/fragfile.dat": withPrefix("/data/fragfile.dat"),
      "ctf/fragfile.dat": withPrefix("/data/fragfile.dat"),
      [demoMountPath]: demoUrl,
      ...mapContent,
    };

    this.setState({ numAssets: Object.keys(assets).length });

    window.Module = {
      canvas: this.canvasRef.current,
      files: assets,
      setStatus: this.updateLoadProgress.bind(this),
    };

    const fteScript = document.createElement("script");
    fteScript.src = withPrefix("/ftewebgl.js");

    document.head.appendChild(fteScript);

    screenfull.on("change", this.onResize.bind(this));
    window.addEventListener("resize", this.onResize.bind(this));

    /*const parts = window.location.hash.substring(1).split("&");
    for (let i = 0; i < parts.length; i++) {
      const kv = parts[i].split("=");
      if (kv.length !== 2) continue;
      switch (kv[0]) {
        case "player":
          this.setState({ initialPlayer: Number.parseInt(kv[1]) });
          break;
        case "speed":
          this.setState({ initialSpeed: Number.parseInt(kv[1]) });
          break;
        case "position":
          this.setState({ initialPosition: Number.parseInt(kv[1]) });
          break;
        case "loop":
          this.setState({ loop: Number.parseInt(kv[1]) });
          break;
      }
    }*/

    setInterval(this.onFteRefresh.bind(this), 250);
  }

  updateLoadProgress(text) {
    const found = text.match(/.+ [(]([^/]+)\/([^)]+)[)]/);
    if (found && found.length === 3 && found[1] === found[2]) {
      this.setState({ loadProgress: this.state.loadProgress + 1 });
    }
  }

  onFteRefresh() {
    if (window.Module.gametime) {
      this.setState({ gametime: window.Module.gametime() });
    }
    if (
      this.state.playerControlTimeout !== 0 &&
      this.state.playerControlTimeout < Date.now()
    ) {
      window.Module.execute("viewsize 100");
      this.setState({ playerControlTimeout: 0 });
    }
    if (this.state.firstRefresh && this.state.gametime > 0) {
      this.onResize();

      // Workaround for not being able to bind an alias to TAB key for RQ demos
      if (/.+.dem/.test(this.props.demo)) {
        window.Module.execute("bind tab +showteamscores");
      }

      if (this.state.initialPlayer) {
        window.Module.execute("cl_autotrack off");
        window.Module.execute("autotrack off");
        window.Module.execute("track " + this.state.initialPlayer); // cmd: users for userId
      }
      if (this.state.initialSpeed) {
        window.Module.execute("demo_setspeed " + this.state.initialSpeed);
      }
      if (this.state.initialPosition) {
        window.Module.execute("demo_jump " + this.state.initialPosition);
      }
      this.setState({ firstRefresh: false });
    }

    if (
      this.state.loop &&
      this.state.gametime >= this.state.initialPosition + this.state.loop
    ) {
      window.Module.execute("demo_jump " + this.state.initialPosition);
    }

    if (
      this.state.playbackSpeed !== 0 &&
      this.state.playbackSpeed !== this.state.targetSpeed
    ) {
      const now = performance.now();
      if (now >= this.state.targetSpeedArrivalTime) {
        window.Module.execute("demo_setspeed " + this.state.targetSpeed);
        this.setState({ playbackSpeed: this.state.targetSpeed });
      } else {
        const progress = (this.state.targetSpeedArrivalTime - now) / easingTime;
        const easing = 1 - progress * (2 - progress);
        if (this.state.playbackSpeed > this.state.targetSpeed) {
          const speed =
            this.state.playbackSpeed -
            (this.state.playbackSpeed - this.state.targetSpeed * 1.0) * easing;
          window.Module.execute("demo_setspeed " + speed);
          this.setState({ playbackSpeed: speed });
        } else {
          const speed =
            this.state.playbackSpeed +
            (this.state.targetSpeed - this.state.playbackSpeed * 1.0) * easing;
          window.Module.execute("demo_setspeed " + speed);
          this.setState({ playbackSpeed: speed });
        }
      }
      const time = 2000 / performance.now();
    }

    // This is a hack, seeking causes player to switch
    if (this.state.gametime > 0 && this.state.initialPlayer) {
      window.Module.execute("track " + this.state.initialPlayer); // cmd: users for userId
    }
  }

  onCanvasClick(event) {
    switch (event.detail) {
      case 1:
        this.togglePlay();
        break;
      case 2:
        this.toggleFullscreen();
        break;
      default:
        break;
    }
  }

  togglePlay() {
    if (this.state.playing) {
      window.Module.execute("demo_setspeed 0");
      this.setState({ playing: false });
    } else {
      window.Module.execute("demo_setspeed " + this.playbackSpeed);
      this.setState({ playing: true });
    }
  }

  onResize() {
    window.onresize();

    const width =
      window.screen.orientation.angle === 0
        ? this.playerRef.current.clientWidth
        : this.playerRef.current.clientHeight;

    // Arbitrary scaling ratio based on 4 * DPI for 4k fullscreen.
    window.Module.execute(
      "vid_conautoscale " +
        Math.ceil(4.0 * window.devicePixelRatio * (width / 3840.0)).toString(),
    );
  }

  toggleFullscreen() {
    if (screenfull.isFullscreen) {
      screenfull.exit();
    } else {
      screenfull.request(this.playerRef.current);
      window.onresize();
    }
  }

  toggleMuted() {
    if (this.state.volumeMuted) {
      this.setState({ volumeMuted: false });
      const volume = this.state.volume * this.state.volume;
      window.Module.execute("volume " + volume);
    } else {
      this.setState({ volumeMuted: true });
      window.Module.execute("volume 0");
    }
  }

  onVolumeChange(e) {
    const volume = this.state.volume * this.state.volume;
    window.Module.execute("volume " + volume);
    this.setState({ volume: e.target.value });
    if (e.target.value === 0) {
      this.setState({ volumeIcon: faVolumeOff });
    } else if (e.target.value < 0.5) {
      this.setState({ volumeIcon: faVolumeLow });
    } else {
      this.setState({ volumeIcon: faVolumeHigh });
    }
  }

  onMouseMove() {
    // Avoid spamming the react state
    if (this.state.playerControlTimeout - Date.now() < 2500) {
      this.setState({ playerControlTimeout: Date.now() + 3000 });
      window.Module.execute("viewsize 120");
    }
  }

  onMouseLeave(event) {
    this.setState({ playerControlTimeout: Date.now() + 250 });
  }

  onTouchStart() {
    window.Module.execute("+scoreboard");
  }

  onTouchEnd() {
    window.Module.execute("-scoreboard");
  }

  onDemoSeek(event) {
    const playerOffsetX = this.playerRef.current.offsetLeft;
    const playerWidth = this.playerRef.current.offsetWidth;
    const seekPosition =
      ((event.clientX - playerOffsetX) / playerWidth) *
      (this.props.duration + 10);
    window.Module.execute("demo_jump " + Math.floor(seekPosition));
    this.setState({ playerControlTimeout: Date.now() + 3000 });
  }

  toggleSlowMotion(event) {
    if (!this.state.playbackSpeed == 0) {
      if (this.state.targetSpeed === 100) {
        this.setState({
          targetSpeed: 20,
          targetSpeedArrivalTime: event.timeStamp + easingTime,
        });
      } else {
        this.setState({
          targetSpeed: 100,
          targetSpeedArrivalTime: event.timeStamp + easingTime,
        });
      }
    }
  }

  render() {
    const gametime = secondsToString(this.state.gametime);
    const gametimeProgress =
      ((this.state.gametime / this.props.duration) * 100.0).toString() + "%";
    const loadProgress = this.state.numAssets
      ? Math.round(this.state.loadProgress / this.state.numAssets)
      : 0;
    return (
      <div
        ref={this.playerRef}
        onMouseMove={this.onMouseMove.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}
        onBlur={this.onMouseLeave.bind(this)}
        className={playerStyle.videoPlayer}
      >
        <div className={playerStyle.curtain}>
          <div
            className={`${
              this.state.firstRefresh
                ? playerStyle.curtainLeft
                : playerStyle.curtainLeftOpen
            }`}
          >
            blue-hammer.png
          </div>
          <div
            className={`${
              this.state.firstRefresh
                ? playerStyle.curtainRight
                : playerStyle.curtainRightOpen
            }`}
          >
            red-flash.png
          </div>
          <canvas
            id="canvas"
            ref={this.canvasRef}
            className={playerStyle.emscripten}
            onClick={this.onCanvasClick.bind(this)}
            onTouchStart={this.onTouchStart.bind(this)}
            onTouchEnd={this.onTouchEnd.bind(this)}
            style={{
              cursor: this.state.playerControlTimeout ? "auto" : "none",
            }}
          />
          <div
            className={
              this.state.playerControlTimeout
                ? playerStyle.playerControlsShow
                : playerStyle.playerControls
            }
          >
            <div className={playerStyle.playerControlsShowInner}>
              <div
                className={playerStyle.videoProgress}
                onClick={this.onDemoSeek.bind(this)}
              >
                <div
                  className={playerStyle.videoProgressFilled}
                  style={{ width: gametimeProgress }}
                ></div>
              </div>
              <button
                className={playerStyle.playButton}
                title="Play"
                onClick={this.togglePlay.bind(this)}
              >
                <FontAwesomeIcon icon={this.state.playing ? faPause : faPlay} />
              </button>
              <button
                className={playerStyle.volumeButton}
                title="Volume"
                onClick={this.toggleMuted.bind(this)}
              >
                <FontAwesomeIcon
                  icon={
                    this.state.volumeMuted
                      ? faVolumeXmark
                      : this.state.volumeIcon
                  }
                />
              </button>
              <input
                type="range"
                className={playerStyle.volumeRange}
                min="0"
                max="1"
                step="0.01"
                value={this.state.volume}
                disabled={this.state.volumeMuted}
                onChange={this.onVolumeChange.bind(this)}
              />
              <div className={playerStyle.time}>
                <span id="demotime">
                  {gametime} / {this.duration}
                </span>
              </div>
              <button
                className={playerStyle.speedButton}
                onClick={this.toggleSlowMotion.bind(this)}
                style={{ color: "white" }}
              >
                <FontAwesomeIcon icon={faGauge} />
              </button>
              <button
                className={playerStyle.fullscreenButton}
                onClick={this.toggleFullscreen.bind(this)}
                style={{ color: "white" }}
              >
                <FontAwesomeIcon icon={faExpand} />
              </button>
            </div>
          </div>
        </div>
        <div
          className={playerStyle.progressWrapper}
          style={{ opacity: this.state.firstRefresh ? 1 : 0 }}
        >
          <div>{<Progressbar completed={loadProgress * 100} />}</div>
        </div>
      </div>
    );
  }
}

export default FteComponent;
