import Row from "@docspace/components/row";
import UsersRowContent from "./UsersRowContent";

const UsersRow = (props) => {
  const { isChecked, onChangeCheckbox, checkbox, data, sectionWidth, id } =
    props;

  const onChange = (e) => {
    onChangeCheckbox(id, e.target.checked);
  };

  return (
    <>
      <Row
        sectionWidth={sectionWidth}
        key={data.id}
        data={data}
        checked={checkbox.includes(id)}
        checkbox={checkbox}
        onClick={onChange}
      >
        <UsersRowContent
          sectionWidth={sectionWidth}
          displayName={data.displayName}
          email={data.email}
          dublicate={data.dublicate}
          isChecked={isChecked}
          onChangeCheckbox={onChangeCheckbox}
        />
      </Row>
    </>
  );
};

export default UsersRow;
