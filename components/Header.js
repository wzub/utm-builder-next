import { useRouter } from 'next/router';
import Link from 'next/link'
import { useAuth } from '../context/AuthContext';

const Header = () => {

	const { currentUser, logout } = useAuth();
	const router = useRouter();

	const onLogout = async () => {
		logout();
		router.push('/signin');
	}

	return (
		<header className="container-md pt-3">
			<div className="pt-md-5">
				<h1 className="display-1">TCF's UTM Builder</h1>
				<p className="lead">
					A simple utility to generate UTM links en masse.
				</p> 

				<span id="name_container">
						<div className="row align-items-center">
							<div className="col-md-auto">
								<i className="bi bi-person-fill me-1"></i>
								{ currentUser ? <Link href="/user">{`Hello, ${currentUser?.displayName}!`}</Link>
								: <Link href="/signin">Sign in</Link> }
							</div>
							<div className="col-md-auto ms-md-auto">
								{ currentUser ? <button type="submit" className="btn btn-md btn-link mx-2" onClick={onLogout}>Logout</button> : null }
							</div>
						</div>
				</span>
			</div>
			<hr className="my-2" />
		</header>	
	);
};

export default Header;
