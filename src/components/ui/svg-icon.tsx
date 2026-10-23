export function SvgIcon({
  filename,
  size = 24,
}: {
  filename: string;
  size?: number;
}) {
  return (
    <img
      src={`https://hub.quakeworld.nu/assets/img/icons/${filename}.svg`}
      width={size}
      height={size}
      className="fill-white text-white inline mr-2"
      alt=""
    />
  );
}
