import React from 'react'
import styled, { css } from 'styled-components'

const Section = styled.section`
    position: relative;
    ${props => props.leftColour 
        && props.rightColour 
        && css`background-image: linear-gradient(50deg, ${props.leftColour}, ${props.rightColour});` }
    color: white;
`

const Container = styled.div`
    display: flex;
    align-items: center;
    display: flex;
    justify-content: space-evenly;
    padding-top: 1em;
    padding-bottom: 1em;
`

const Figure = styled.div`
    font-size: 8em;
    z-index: 1;
`

const Suffex = styled.span`
    font-size: 0.5em;
`

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
`

const Image = styled.img`
    width: 12em;
    justify-self: flex-end;
    ${ props => props.bottom && css`
        position: relative; 
        bottom: -1em
    `}
`

const Header = (props) => {
    return (
        <Section leftColour={props.leftColour} rightColour={props.rightColour}>
            <HeaderContainer>
                <div id="last-reading">{props.date} ago</div>
                    <div id="battery">
                    <img src="./battery.svg"></img>
                </div>
            </HeaderContainer>
            <Container>
                <Figure className="headline-figure">{props.value}<Suffex>{props.suffex}</Suffex></Figure>
                <Image src={props.image} bottom={props.bottom}></Image>
            </Container>
        </Section>
    )
}

export default Header;