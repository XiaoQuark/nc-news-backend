exports.isUsernameValid = (username) => {
	return !/\s/.test(username);
};
