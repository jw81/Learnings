import PropTypes from "prop-types";

function FilterButton( { label, isActive, onClick } ) {
  return (
    <button
      className={isActive ? "active" : ""}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

FilterButton.propTypes = {
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default FilterButton;