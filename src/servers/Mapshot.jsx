export function Mapshot({ map, children }) {
  const backgroundImage = `url(https://raw.githubusercontent.com/vikpe/qw-mapshots/main/${map}.jpg)`;

  return (
    <div className="h-full bg-cover bg-center bg-[url(https://hub.quakeworld.nu/assets/img/default_mapshot.jpg)]">
      <div className="h-full bg-cover bg-center" style={{ backgroundImage }}>
        <div className="h-full bg-gray-700/20">{children}</div>
      </div>
    </div>
  );
}
