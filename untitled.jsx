import React,{PureComponent} from 'react';
export default class Header extends PureComponent{
	render(){
		return(
			<header className="header">
				<div className="header-main">
					<HeaderButton/>
				</div>
			</header>
		)
	}
}