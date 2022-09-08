import styled from "styled-components";
import { Card } from 'primereact/card';
import bg from "../../assets/library.jpg"

export const HomeContainer = styled.div`
  height: 100%;
  width: 100%;
  background-image: url(${bg});
  background-size: cover;
  padding: 25px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`
export const CardHome = styled(Card)`
  max-width: 300px;
  max-height: 150px;
`
