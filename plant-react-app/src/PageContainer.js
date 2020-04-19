import React from 'react'
import Page from './Page'

class PageContainer extends React.Component {
    constructor(props) {
        super(props);

        let pageCount = 0;
        props.children.forEach(child => {
            if(child.type.name == Page.name) {
                pageCount++;
            }
        })

        this.state = {
            pageCount: pageCount,
            currentPage: 1
        }
    }

    componentDidMount() {
        document.addEventListener("left-swipe", this.handleLeftSwipe);
        document.addEventListener("right-swipe", this.handleRightSwipe);
    }

    handleLeftSwipe = () => {
        if(this.state.currentPage >= this.state.pageCount) {
            this.setState({ currentPage: this.state.currentPage - 1})
            var pgContainer = document.getElementsByClassName("page-container")[0];
            pgContainer.style.setProperty("--pageIndex", this.state.currentPage -1);
        }
    }

    handleRightSwipe = () => {
        if(this.state.currentPage < this.state.pageCount) {
            this.setState({ currentPage: this.state.currentPage + 1})
            var pgContainer = document.getElementsByClassName("page-container")[0];
            pgContainer.style.setProperty("--pageIndex", this.state.currentPage -1);
        }
    }

    render(){
        let pageIcons = this.props.children.map((child, i) => {
            if(child.type.name == Page.name) {
                let classes = ["page-icon"];
                if(i + 1 == this.state.currentPage) {
                    classes.push("active");
                }
                return <div key={i} className={classes.join(" ")}></div>
            }
        });

        return (
            <div className="page-container">
                {this.props.children}
                <div className="page-icons">
                    {pageIcons}
                </div>
            </div>
        )
    }
}

export default PageContainer