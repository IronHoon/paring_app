import styled from 'styled-components/native';
import COLOR from '../../../../constants/COLOR';

const AlignedModalItem = styled.Pressable`
  border-bottom-width: ${(props) => (props.hasBorder ? '1px' : 0)};
  border-bottom-color: ${COLOR.HR_GRAY};
  flex: 1;
  justify-content: center;
  padding-left: 22px;
`;

export { AlignedModalItem };
