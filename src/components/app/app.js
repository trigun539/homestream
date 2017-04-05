import React, { Component }  from 'react';
import styles from './styles.css';

export default class App extends Component {
	render () {
		return (
			<h1 className={ styles['title'] } >Hello Wolrd</h1>
		);
	}
}
