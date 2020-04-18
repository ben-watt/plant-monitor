import React from 'react'

class PageContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageCount: 0,
            activePageIndex: 0
        }
    }

    render(){
        let pageIcons = this.props.children.map((child, i) => {
            if(child.type.name == "Page") {
                return <div key={i} className="page-icon"></div>
            }
        });

        return (
            <>
                {this.props.children}
                <div className="page-icons">
                    {pageIcons}
                </div>
            </>
        )
    }
}

export default PageContainer