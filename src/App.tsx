import React from 'react';
import './styles/imports.scss';
import './styles/App.scss';
import fb from './config/fireBase.js';
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom';
import Login from './components/Login';
import HomePage from './components/HomePage';
import UserProfile from './components/UserProfile';
import PostPage from './components/PostPage';
import PageNotFound from './components/PageNotFound';
import Settings from './components/Settings';
import createOrUpdatePost from './services/createOrUpdatePost';
import UserInformation from './models/UserInformation';
import { FireBaseUserObj } from './models/FireBaseUserObj';
import { Posts } from './models/Posts';
import SearchBox from './components/SearchBox';
import PostCreationForm from './components/PostCreationForm';
import { FormTypes } from './enums/FormTypes';
interface IState {
	userObj: FireBaseUserObj | null
	isFirstLogin: boolean,
	viewingAccountMenu: boolean,
	defaultProfilePicture: string,
	postsToShow: Posts[],
	allPosts: Posts[],
	currentUserPosts: Posts[],
	creatingNewPost: boolean,
	isOnline: boolean,
	isAdmin: boolean,
	isSearching: boolean,
	showPostCreationMessage: boolean
}

export const IsAdminContext = React.createContext(false);
export default class App extends React.Component<{}, IState> {

	constructor(props: any) {
		super(props);
		this.state = {
			userObj: null,
			isFirstLogin: false,
			viewingAccountMenu: false,
			defaultProfilePicture: 'https://racemph.com/wp-content/uploads/2016/09/profile-image-placeholder.png',
			postsToShow: [],
			allPosts: [],
			currentUserPosts: [],
			creatingNewPost: false,
			isOnline: false,
			isAdmin: false,
			isSearching: false,
			showPostCreationMessage: false
		}
	}

	componentDidMount() {
		this.onAuth();
		this.setState({ isOnline: true });
	}

	private searchPosts(input: string):void {

		if(input === "") {
			this.setState({ postsToShow: this.state.allPosts, isSearching: false });
		} else {
			const searchResults = this.state.postsToShow.filter((post: Posts) => {
				return post.content.title.includes(input)
			});
	
			this.setState({ postsToShow: searchResults, isSearching: true });
		}
	}

	private onAuth():void {
		fb.auth().onAuthStateChanged((user: any) => {
			if(user) {
				this.setState({userObj: user });
				this.fetchPosts();
				this.isAdmin()
			}
		});
	}

	private isAdmin():void {
		const db = fb.firestore()
		const ref = db.collection('admins')
		const query = ref.where('uid', '==', this.state.userObj?.uid)
		if(query) {
			this.setState({ isAdmin: true })
		}
	}

	private authUser(authType: string, userInput: {email: string, password: string, repeatedPassword: string}):void {
		if(authType === 'LOGIN') {
			fb.auth().signInWithEmailAndPassword(userInput.email, userInput.password).then((user)=> {
				console.log('authenticated');
			}).catch((err)=> {
				console.log(err);
			});
		} else {
			this.setState({ isFirstLogin: true });
			fb.auth().createUserWithEmailAndPassword(userInput.email, userInput.password).then((user)=> {
				fb.auth().currentUser?.updateProfile({
					photoURL: this.state.defaultProfilePicture
				})
			}).catch((err)=> {
				console.log(err);
			})
		}
	}

	private async fetchPosts() {
		const snapshot = await fb.firestore().collection('/posts').get();
		const postData = snapshot.docs.map(doc => doc.data());
		const sortedPostData = postData.sort((a, b) => b.content.time.toString().localeCompare(a.content.time.toString()));
		const currentUserPosts = postData.filter((post) => {
			return post.content.userId === this.state.userObj?.uid
		})
		//@ts-ignore
		this.setState({ postsToShow: sortedPostData, currentUserPosts: currentUserPosts, allPosts: sortedPostData});
	}

	private updateInitialInformation(userObj: UserInformation):void {
		fb.auth().currentUser?.updateProfile({
			displayName: userObj.displayName,
			photoURL: userObj.photoURL || this.state.defaultProfilePicture,
		});
		fb.firestore().collection('/profiles').doc(this.state.userObj?.uid).set({
			displayName: userObj.displayName,
			photoURL: userObj.photoURL || this.state.defaultProfilePicture,
			description: userObj.description,
			occupation: userObj.occupation,
			location: userObj.location,
			isOnline: true,
			dateCreated: this.state.userObj?.metadata.creationTime,
		});
		this.setState({ isFirstLogin: false });
	}

	private logOut():void {
		fb.auth().signOut().then(() => {
			this.setState({ userObj: null });
		}).catch((err) => {
			console.log(err);
		})
	}

	private createNewPost(title: string, body: string): void {
		let content = createOrUpdatePost("CREATE", title, body)
		if(content){
			this.state.postsToShow.splice(0, 0, { content });
			this.setState({ creatingNewPost: false, showPostCreationMessage: true });

			setTimeout(()=> {
				this.setState({ showPostCreationMessage: false });
			}, 1000);
		}
	}

	private cancelPostCreation(): void {
		this.setState({ creatingNewPost: false });
	}

	public render() {
		return(
			<IsAdminContext.Provider value={this.state.isAdmin}>
				<Router>
					<Switch>
						<Route exact path="/" render={() => (<Redirect to={this.state.userObj? "/home" : '/login'} />)} />
							{!this.state.userObj ?
								<>
									<Route exact path="/home" render={() => (<Redirect to="/login" />)} />
									<Route exact path='/login'>
										<Login authUser={this.authUser.bind(this)} />
									</Route>
								</> :
								<>
								<Route exact path="/login" render={() => (<Redirect to="/home" />)} />
								<div className='top-bar'>
									<Link to='/home'>
										<h1>BlogIT</h1>
									</Link>
									<SearchBox searchPosts={this.searchPosts.bind(this)} />
									<div className='button-group'>
										<button onClick={()=> this.setState({ creatingNewPost: true })} title='Create new post'>+</button>
										<Link to='/home'>
											<button title='Home page'>
												<img alt='home' src='https://cdn4.iconfinder.com/data/icons/pictype-free-vector-icons/16/home-512.png' />
											</button>
										</Link>
										<button onClick={()=> this.setState({ viewingAccountMenu: !this.state.viewingAccountMenu })} title={fb.auth().currentUser?.displayName!}>
											<img alt='profile' src={fb.auth().currentUser?.photoURL!}/>
										</button>
									</div>
								</div>
								{this.state.creatingNewPost && 
									<PostCreationForm 
										formTitle="Create new post" 
										formType={FormTypes.create} 
										createNewPost={this.createNewPost.bind(this)} 
										cancelPostCreation={this.cancelPostCreation.bind(this)} 
								/>
								}
								{this.state.viewingAccountMenu &&
									<div className='user-menu'>
										<div className='user-box'>
											<img alt='profile' src={fb.auth().currentUser?.photoURL!} />
											<span>{fb.auth().currentUser?.displayName}</span>
										</div>
										<div className='user-menu_options'>
											<Link to={`/user/${fb.auth().currentUser?.uid}`}>
												<button>
													<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 100 125" x="0px" y="0px"><title>collection 1</title><path d="M50,5a45,45,0,1,0,0,90,44.493,44.493,0,0,0,28.21-9.94238A44.99844,44.99844,0,0,0,50,5Zm-.001,15.75854A14.62067,14.62067,0,1,1,35.37836,35.37921,14.62067,14.62067,0,0,1,49.999,20.75854ZM78.834,76.25781a39.24659,39.24659,0,0,1-4.38671,4.126,38.95972,38.95972,0,0,1-53.28125-4.126c-.64466-.70611-1.2522-1.43866-1.8393-2.18463,2.3938-9.915,15.20856-17.49328,30.67334-17.49328,15.45477,0,28.27594,7.5772,30.67261,17.49127C80.08582,74.81775,79.47839,75.5509,78.834,76.25781Z"/></svg>
													<span>Profile</span>
												</button>
											</Link>
											<Link to='/settings'>
												<button>
													<span>Settings</span>
													<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 100 125" x="0px" y="0px"><title>all</title><g><g><g data-name="Zoom In"><g data-name="Calendar"><g><g><g><g><g><g><g><g><g data-name="Play - Orange"><g data-name="Arrow Right - Orange"><g><path d="M86.29,37.3l-1.7-4.12c5.83-13.45,5.45-13.85,4.31-15l-7.45-7.43-0.74-.64H79.85c-0.46,0-1.81,0-13.14,5.24l-4.17-1.72C57.15,0,56.6,0,55,0H44.51c-1.58,0-2.19,0-7.18,13.68L33.18,15.4c-7.65-3.3-12.14-5-13.35-5l-1,0-8,8C9.6,19.65,9.17,20.06,15.34,33.3l-1.7,4.11C0,42.79,0,43.31,0,45V55.48c0,1.65,0,2.23,13.69,7.24l1.7,4.1c-5.83,13.45-5.44,13.85-4.31,15l7.45,7.44,0.74,0.65h0.87c0.45,0,1.79,0,13.13-5.25l4.16,1.73C42.82,100,43.37,100,45,100H55.47c1.61,0,2.18,0,7.19-13.67l4.17-1.72c7.65,3.3,12.12,5,13.33,5l1,0,8.08-8.07c1.15-1.18,1.55-1.59-4.58-14.78l1.69-4.11C100,57.21,100,56.64,100,55V44.52C100,42.87,100,42.29,86.29,37.3ZM50,67.49A17.5,17.5,0,1,1,67.46,50,17.52,17.52,0,0,1,50,67.49Z"/></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g>></svg>
												</button>
											</Link>
											<button onClick={()=> this.logOut()}>
												<span>Log out</span>
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 30" x="0px" y="0px"><title>Arrow, entrance, exit, signout, log, out, logout </title><g><path d="M22.707,12.707l-4,4-1.414-1.414L19.5859,13H7v2h8v6a1.0029,1.0029,0,0,1-1,1H2a1.0029,1.0029,0,0,1-1-1V3A1.0029,1.0029,0,0,1,2,2H14a1.0029,1.0029,0,0,1,1,1v8h4.5859L17.293,8.707l1.414-1.414,4,4A.9994.9994,0,0,1,22.707,12.707Z"/></g></svg>
											</button>
										</div>
									</div>
								}
								<Route exact path='/home'>
									<HomePage
										isFirstLogin={this.state.isFirstLogin}
										updateInitialInformation={this.updateInitialInformation.bind(this)}
										posts={this.state.postsToShow}
										genericProfilePicture={this.state.defaultProfilePicture}
										isSearching={this.state.isSearching}
										showPostCreationMessage={this.state.showPostCreationMessage}
									/>
								</Route>
								<Route path='/settings'>
									<Settings
										userObj={this.state.userObj}
									/>
								</Route>
								<Route path='/user/:id' component={UserProfile} />
								<Route path='/404'>
									<PageNotFound />
								</Route>
								<Route path='/posts/:id'>
									<PostPage cancelPostCreation={this.cancelPostCreation.bind(this)} />
								</Route>
							</>
						}
					</Switch>
				</Router>
			</IsAdminContext.Provider>
		)
	}
}