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
    padding-top: 4em;
`

const Figure = styled.div`
    font-size: 8em;
    z-index: 1;
`

const Suffex = styled.span`
    font-size: 0.5em;
`

const Image = styled.img`
    width: 7em;
    height: 7em;
    justify-self: end;
    ${ props => props.bottom && css`
        align-self: flex-end;
    `}
`

const Header = (props) => {
    return (
        <Section leftColour={props.leftColour} rightColour={props.rightColour}>
            <Container>
                <Figure className="headline-figure">
                    {props.value}<Suffex>{props.suffex}</Suffex>
                </Figure>
                <Image src={props.image} bottom={props.bottom}></Image>
            </Container>
        </Section>
    )
}

export default Header;