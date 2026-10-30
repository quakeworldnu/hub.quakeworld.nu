import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import {
  faChevronDown,
  faComputerMouse,
  faCrosshairs,
  faEye,
  faFillDrip,
  faFont,
  faGear,
  faLightbulb,
  faPaintRoller,
  faShirt,
  faStopwatch,
  faVideo,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useBoolean, useEventListener, useResizeObserver } from "usehooks-ts";
import { FontAwesomeIcon } from "@/components/ui/icon";
import { Switch } from "@/components/ui/switch";
import { getAssetUrl } from "@/lib/cloudfront/assets";
import type { FteController } from "@/lib/fte/fte-controller";
import { useFteController } from "@/lib/fte/hooks";
import {
  enqueueSetting,
  FteSettingsEvent,
  hexToRgb,
  hideFteSettings,
  type NumericalSettings,
  readSettings,
  rgbStringToHex,
  type Settings,
  storeSetting,
  type ToggleSetting,
  toggleFteSettings,
} from "@/lib/fte/settings";
import { IconButton } from "./icon-button";

const CROSSHAIRS = ["circle", "square", "crosshair"];
const CHARSETS = ["default", "povo5f_xtm", "graybugs"];
const SKIN_COLORS = ["blue", "cyan", "green", "pink", "red", "white", "yellow"];
const SKIN_VARIANTS = ["", "_solid"];
const QTV_BUFFER_TIMES = [1, 3, 5];

function skinUrl(skin: string): string {
  return getAssetUrl(`fte/id1/skins/${skin}.jpg`);
}

function crosshairUrl(image: string): string {
  return CROSSHAIRS.includes(image)
    ? `/assets/fte/crosshairs/${image}.png`
    : getAssetUrl(`fte/id1/crosshairs/${image}.png`);
}

export const SettingsToggle = () => {
  const fte = useFteController();

  if (!fte) {
    return null;
  }

  return (
    <IconButton
      onClick={toggleFteSettings}
      title="Toggle settings"
      icon={faGear}
    />
  );
};

export const FteSettings = () => {
  const fte = useFteController();
  const { value: isVisible, toggle, setFalse: hide } = useBoolean(false);
  useEventListener(FteSettingsEvent.Toggle, toggle);
  useEventListener(FteSettingsEvent.Hide, hide);

  if (!fte || !isVisible) {
    return null;
  }

  return <SettingsPanel fte={fte} />;
};

type SetSetting = <K extends keyof Settings>(
  key: K,
  value: Settings[K],
) => void;

const SettingsPanel = ({ fte }: { fte: FteController }) => {
  // end above the player controls bar (its height differs per player and wraps)
  const controlsRef = useRef<HTMLElement>(
    document.getElementById("ftePlayerControls"),
  );
  const { height: controlsHeight = 0 } = useResizeObserver({
    ref: controlsRef as React.RefObject<HTMLElement>,
    box: "border-box",
  });

  // synced from the engine each time the panel opens
  const [settings, setSettings] = useState<Settings>(() => readSettings(fte));

  const setSetting: SetSetting = (key, value) => {
    setSettings((s) => ({ ...s, [key]: value }));
    enqueueSetting(fte, key, value);
    storeSetting(key, value);
  };

  function toggleSetting(key: ToggleSetting) {
    setSetting(key, settings[key] ? 0 : 1);
  }

  return (
    // phones: full-screen overlay, the player is too small to host a sidebar
    <div
      className="fixed inset-0 z-50 sm:absolute sm:inset-auto sm:z-40 sm:top-0 sm:right-0 sm:bottom-(--controls-height) sm:w-md sm:max-w-full flex flex-col bg-slate-900/95 text-sm"
      style={
        { "--controls-height": `${controlsHeight}px` } as React.CSSProperties
      }
    >
      <div className="flex h-12 px-4 shrink-0 items-center justify-between border-b border-white/10">
        <div className="text-slate-300 text-lg flex items-center gap-2">
          <FontAwesomeIcon icon={faGear} /> Settings
        </div>
        <button
          type="button"
          className="size-8 rounded-full bg-white/10 hover:bg-white/20"
          title="Close"
          onClick={hideFteSettings}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Section
          icon={faShirt}
          title="Skins"
          summary={
            <div className="flex gap-1">
              {[settings.teamskin, settings.enemyskin]
                .filter((skin) => skin !== "")
                .map((skin, i) => (
                  <img
                    key={`${skin}-${i}`}
                    src={skinUrl(skin)}
                    className="h-6"
                    alt={skin}
                  />
                ))}
            </div>
          }
        >
          <div className="font-semibold mb-2">Teamskin</div>
          <SkinSelector
            value={settings.teamskin}
            onSelect={(v) => setSetting("teamskin", v)}
          />
          <div className="font-semibold mt-6 mb-2">Enemyskin</div>
          <SkinSelector
            value={settings.enemyskin}
            onSelect={(v) => setSetting("enemyskin", v)}
          />
        </Section>

        <Section
          icon={faFont}
          title="Charset"
          summary={<small className="text-slate-400">{settings.gl_font}</small>}
        >
          <div className="flex gap-4 flex-wrap">
            {CHARSETS.map((charset) => (
              <button
                type="button"
                key={charset}
                className={clsx(
                  "hover:outline-2 outline-sky-600 flex flex-col items-center gap-1 w-30",
                  { "outline-2": settings.gl_font === charset },
                )}
                onClick={() => setSetting("gl_font", charset)}
              >
                <img
                  src={`/assets/fte/charsets/${charset}.png`}
                  className="size-28"
                  alt={charset}
                />
                <div className="text-xs text-slate-300">{charset}</div>
              </button>
            ))}
          </div>
        </Section>

        <Section icon={faFillDrip} title="Graphics">
          <Row title="FOV" description="Adjust field of view">
            <NumericalInput
              value={settings.fov}
              onChange={(v) => setSetting("fov", v)}
              min={90}
              max={160}
              step={10}
            />
          </Row>
          <Row title="Gamma" description="Adjust overall brightness">
            <NumericalInput
              value={settings.gamma}
              onChange={(v) => setSetting("gamma", v)}
              min={0}
              max={2}
              step={0.1}
            />
          </Row>
          <Row title="Contrast" description="Adjust color intensity">
            <NumericalInput
              value={settings.contrast}
              onChange={(v) => setSetting("contrast", v)}
              min={0}
              max={2}
              step={0.1}
            />
          </Row>
          <SettingToggle
            icon={faLightbulb}
            title="Dynamic lighting"
            description="Powerups, rockets and explosions (cost fps)"
            enabled={settings.r_dynamic !== 0}
            onClick={() => toggleSetting("r_dynamic")}
          />
          <SettingToggle
            icon={faPaintRoller}
            title="Drawflat"
            description="Render walls and floors with flat colors"
            enabled={settings.r_drawflat !== 0}
            onClick={() => toggleSetting("r_drawflat")}
          />
        </Section>

        <Section icon={faComputerMouse} title="Input">
          <Row title="Sensitivity" description="Adjust mouse sensitivity">
            <NumericalInput
              value={settings.sensitivity}
              onChange={(v) => setSetting("sensitivity", v)}
              min={5}
              max={15}
              step={1}
            />
          </Row>
          <Row
            title="Invert mouse"
            description="Invert vertical mouse movement"
          >
            <Switch
              label=""
              enabled={settings.m_pitch < 0}
              onClick={() => setSetting("m_pitch", -settings.m_pitch)}
              title="Invert mouse"
            />
          </Row>
        </Section>

        <Section
          icon={faCrosshairs}
          title="Crosshair"
          summary={
            <CrosshairPreview
              image={settings.crosshairimage}
              color={settings.crosshaircolor}
            />
          }
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              {CROSSHAIRS.map((shape) => (
                <button
                  type="button"
                  key={shape}
                  onClick={() => setSetting("crosshairimage", shape)}
                >
                  <img
                    src={crosshairUrl(shape)}
                    className={clsx("hover:outline-2 outline-sky-600 h-4", {
                      "outline-2": settings.crosshairimage === shape,
                    })}
                    title={shape}
                    alt={shape}
                  />
                </button>
              ))}
            </div>
            <input
              type="color"
              value={rgbStringToHex(settings.crosshaircolor)}
              onChange={(e) =>
                setSetting("crosshaircolor", hexToRgb(e.target.value).join(" "))
              }
            />
            <NumericalInput
              value={settings.crosshairsize}
              onChange={(v) => setSetting("crosshairsize", v)}
              min={1}
              max={20}
              step={1}
            />
          </div>
        </Section>

        <Section
          icon={faEye}
          title="Spectator Features"
          summary={
            <div className="flex gap-2">
              <StatusIcon icon={faEye} enabled={settings.xray !== 0} />
              <StatusIcon
                icon={faVideo}
                enabled={settings.powcam_enabled !== 0}
              />
              <StatusIcon
                icon={faStopwatch}
                enabled={settings.cl_item_timers !== 0}
              />
            </div>
          }
        >
          <SettingToggle
            icon={faEye}
            title="X-ray"
            description="See players through walls"
            enabled={settings.xray !== 0}
            onClick={() => toggleSetting("xray")}
          />
          <SettingToggle
            icon={faVideo}
            title="Powerup Camera"
            description="Picture-in-picture cameras at powerup spawns"
            enabled={settings.powcam_enabled !== 0}
            onClick={() => toggleSetting("powcam_enabled")}
          />
          <SettingToggle
            icon={faStopwatch}
            title="Item Timers"
            description="Rotating discs showing respawn progress"
            enabled={settings.cl_item_timers !== 0}
            onClick={() => toggleSetting("cl_item_timers")}
          />
        </Section>

        <div className="px-4 py-2">
          <Row title="Name in QTV" description="Visible to other viewers">
            <NameInput
              value={settings.name}
              onChange={(name) => setSetting("name", name)}
            />
          </Row>
          <Row
            title="QTV buffer"
            description="In seconds, higher is smoother but delayed"
          >
            <ButtonGroup
              options={QTV_BUFFER_TIMES}
              value={settings.qtv_buffertime}
              onSelect={(v) => setSetting("qtv_buffertime", v)}
            />
          </Row>
        </div>
      </div>
    </div>
  );
};

// sent on blur (enter blurs) or when the settings close, not per keystroke
// (name changes are visible to others)
const NameInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [name, setName] = useState(value);

  function commit() {
    const name_ = name.trim();

    if (name_ && name_ !== value) {
      onChange(name_);
    } else {
      setName(value);
    }
  }

  // closing the settings unmounts the input without a blur event
  const commitRef = useRef(commit);
  commitRef.current = commit;
  useEffect(() => () => commitRef.current(), []);

  // key events never reach react (see FtePlayerCanvas), enter submits the form
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        (e.currentTarget.elements[0] as HTMLInputElement).blur();
      }}
    >
      <input
        type="text"
        className="w-40 px-2 py-1 rounded bg-black/40 border border-white/10"
        value={name}
        maxLength={31}
        onChange={(e) => setName(e.target.value)}
        onBlur={commit}
      />
    </form>
  );
};

const Section = ({
  icon,
  title,
  summary,
  children,
}: {
  icon: IconDefinition;
  title: string;
  summary?: ReactNode;
  children: ReactNode;
}) => {
  return (
    <details className="group border-b border-white/10">
      <summary className="flex items-center justify-between gap-2 px-4 py-3 cursor-pointer list-none hover:bg-white/5">
        <span className="font-semibold">
          <FontAwesomeIcon
            icon={icon}
            fixedWidth
            className="text-slate-500 mr-3"
          />
          {title}
        </span>
        <span className="flex items-center gap-3">
          {summary}
          <FontAwesomeIcon
            icon={faChevronDown}
            className="text-slate-500 transition-transform group-open:rotate-180"
          />
        </span>
      </summary>
      <div className="px-4 pb-4">{children}</div>
    </details>
  );
};

const Row = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) => {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-slate-400">{description}</div>
      </div>
      {children}
    </div>
  );
};

const ButtonGroup = ({
  options,
  value,
  onSelect,
}: {
  options: number[];
  value: number;
  onSelect: (value: number) => void;
}) => (
  <div className="flex">
    {options.map((option) => (
      <button
        type="button"
        key={option}
        className={clsx(
          "px-3 h-8 text-sm first:rounded-l last:rounded-r border border-[#334]",
          option === value
            ? "bg-slate-600 text-white"
            : "bg-white/5 hover:bg-white/10 hover:text-white",
        )}
        onClick={() => onSelect(option)}
      >
        {option}
      </button>
    ))}
  </div>
);

const NumericalInput = ({
  value,
  onChange,
  min,
  max,
  step,
}: {
  value: NumericalSettings[keyof NumericalSettings];
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}) => {
  const inputProps = {
    value,
    min,
    max,
    step,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = Number.parseFloat(e.target.value);

      if (!Number.isNaN(num)) {
        onChange(num);
      }
    },
  };

  return (
    <div className="flex gap-2 items-center shrink-0">
      <input type="range" className="w-20" {...inputProps} />
      <input
        type="number"
        className="w-14 px-1 py-0.5 rounded bg-black/40 border border-white/10"
        {...inputProps}
      />
    </div>
  );
};

const SettingToggle = ({
  icon,
  title,
  description,
  enabled,
  onClick,
}: {
  icon: IconDefinition;
  title: string;
  description: string;
  enabled: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <div className="flex items-center gap-2 font-semibold">
          <FontAwesomeIcon icon={icon} fixedWidth className="text-slate-400" />
          {title}
        </div>
        <div className="text-slate-400 mt-1">{description}</div>
      </div>
      <Switch label="" enabled={enabled} onClick={onClick} title={title} />
    </div>
  );
};

const StatusIcon = ({
  icon,
  enabled,
}: {
  icon: IconDefinition;
  enabled: boolean;
}) => {
  return (
    <FontAwesomeIcon
      icon={icon}
      className={enabled ? "text-sky-400" : "text-slate-600"}
    />
  );
};

const CrosshairPreview = ({
  image,
  color,
}: {
  image: string;
  color: string;
}) => {
  return (
    <div
      style={{
        background: `rgb(${color.split(" ").join(",")})`,
        mask: `url(${crosshairUrl(image)}) no-repeat center / contain`,
      }}
      className="inline-block size-4"
    />
  );
};

const SkinSelector = ({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (skin: string) => void;
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      {SKIN_COLORS.flatMap((color) =>
        SKIN_VARIANTS.map((suffix) => {
          const skin = `${color}${suffix}`;

          return (
            <button type="button" key={skin} onClick={() => onSelect(skin)}>
              <img
                src={skinUrl(skin)}
                className={clsx("hover:outline-2 outline-sky-600 h-15", {
                  "outline-2": value === skin,
                })}
                title={color}
                alt={skin}
              />
            </button>
          );
        }),
      )}
    </div>
  );
};
