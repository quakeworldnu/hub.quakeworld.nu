import React from "react";
import { connect } from "react-redux";
import slice from "./slice";

const mapStateToProps = (state, ownProps) => ({
  isEnabled: state.browser.ui.favorites.servers.includes(
    ownProps.serverAddress
  ),
});
const mapDispatchToProps = {
  toggleFavoriteServer: slice.actions.toggleFavoriteServer,
};

const FavoriteToggle = (props) => {
  const { toggleFavoriteServer, isEnabled, serverAddress } = props;

  const iconFileName = isEnabled
    ? "star_black_24dp"
    : "star_outline_black_24dp";

  return (
    <div onClick={() => toggleFavoriteServer({ serverAddress })}>
      <img
        src={`/assets/img/icons/${iconFileName}.svg`}
        width="20"
        height="20"
        align="center"
      />
    </div>
  );
};

const FavoriteToggleComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(FavoriteToggle);

export default FavoriteToggleComponent;
