import styled from "styled-components";
import { useTranslation } from "react-i18next";

//@ts-ignore
import { ClientProps } from "@docspace/common/utils/oauth/interfaces";

import Text from "@docspace/components/text";
//@ts-ignore
import { Consumer } from "@docspace/components/utils/context";

//@ts-ignore
import { ViewAsType } from "SRC_DIR/store/OAuthStore";

import TableView from "./TableView";
import RowView from "./RowView";

import RegisterNewButton from "../RegisterNewButton";

const StyledContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  .header {
    margin-bottom: 8px;
  }

  .description {
    margin-bottom: 8px;
  }

  button {
    width: fit-content;

    margin-bottom: 12px;
  }
`;

interface ListProps {
  t: any;
  clients: ClientProps[];
  viewAs: ViewAsType;
}

const List = ({ clients, viewAs }: ListProps) => {
  const { t } = useTranslation(["OAuth", "Common"]);

  return (
    <StyledContainer>
      <Text
        fontSize={"12px"}
        fontWeight={400}
        lineHeight={"16px"}
        title={"OAuth description"}
        tag={""}
        as={"p"}
        color={""}
        textAlign={""}
        className="description"
      >
        {t("OAuthAppDescription")}
      </Text>
      <RegisterNewButton t={t} />
      <Consumer>
        {(context: { sectionWidth: number; sectionHeight: number }) => (
          <>
            {viewAs === "table" ? (
              <TableView
                items={clients || []}
                sectionWidth={context.sectionWidth}
              />
            ) : (
              <RowView
                items={clients || []}
                sectionWidth={context.sectionWidth}
              />
            )}
          </>
        )}
      </Consumer>
    </StyledContainer>
  );
};

export default List;
