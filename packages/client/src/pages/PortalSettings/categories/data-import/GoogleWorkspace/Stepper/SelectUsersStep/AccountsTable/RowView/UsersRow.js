import Row from "@docspace/components/row";
import UsersRowContent from "./UsersRowContent";

const UsersRow = (props) => {
  const { t, data, sectionWidth, isChecked, toggleAccount } = props;

  return (
    <>
      <Row
        sectionWidth={sectionWidth}
        data={data}
        checkbox
        checked={isChecked}
        onClick={toggleAccount}
        onSelect={toggleAccount}
        contextButtonSpacerWidth="0"
      >
        <UsersRowContent
          t={t}
          sectionWidth={sectionWidth}
          displayName={data.displayName}
          email={data.email}
          isDublicate={data.isDublicate}
        />
      </Row>
    </>
  );
};

export default UsersRow;
