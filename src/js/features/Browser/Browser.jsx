import React from 'react';
import { connect } from 'react-redux';

const getClassNames = server => {
  const classNames = [];

  classNames.push('item');

  return classNames;
};

const Server = (props) => {
  const { server } = props;
  const classNamesStr = getClassNames(server).join(' ');
  const gameMode = server.Description.split(', ')[0];

  const players = server.Players.filter(p => !p.Spec);
  const spectators = server.Players.filter(p => p.Spec);

  return (
    <div className={classNamesStr}>

      <div className="header">
        <div className="mapname">{server.Settings.map}</div>
        <div className="mode">{gameMode}</div>
      </div>

      <div className="players">
        {players.map(player => (
          <><span className="playercolor" /> {player.Name}<br /></>
        ))}
      </div>

      <div className="specs">
        {
          spectators.map(spec => (
            <><span className="speccolor">spectator</span> {spec.Name}<br /></>
          ))
        }
      </div>

      <div className="bottom">
        {server.Address}
        <div className="serverdetails">
          <a href="#">QTV&nbsp;&nbsp;</a>
          <a href="#">Spectate&nbsp;&nbsp;</a>
          <a href="#">Join</a>
        </div>
      </div>

    </div>
  );
};

const Browser = (props) => {
  return (
    <div className="masonry">
      {props.servers && props.servers.entries.map((entry, index) => {
          return (
            <div className="tile is-parent">
              <Server key={index} server={entry} />
            </div>
          );
        },
      )}
    </div>
  );
};

const mapStateToProps = (state) => state;

const BrowserComponent = connect(mapStateToProps)(Browser);

export default BrowserComponent;
