import styled from 'styled-components/native';
import COLOR from '../../../../constants/COLOR';

const SpaceBetweenView = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: ${(props) => (props.isContent ? 'flex-start' : 'center')};
  border-color: ${COLOR.BORDER};
  border-top-width: ${(props) => (props.hasBorder ? '1px' : 0)};
  width: 100%;
  overflow: hidden;
`;

export default SpaceBetweenView;
