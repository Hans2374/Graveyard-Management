import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Box, TextField, Tabs, Tab, Button, InputAdornment, IconButton, Link, Typography, Dialog, DialogTitle, DialogContent, FormControlLabel, Checkbox } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { routes } from "../routes";  // Thêm đường dẫn đúng của routes file
import MailOutline from '@mui/icons-material/MailOutline';
import FacebookIcon from '@mui/icons-material/Facebook';

export const Login = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [loginValues, setLoginValues] = useState({ username: '', password: '' });
    const [signupValues, setSignupValues] = useState({ email: '', username: '', password: '', confirmPassword: '' });
    const [loginErrors, setLoginErrors] = useState({});
    const [signupErrors, setSignupErrors] = useState({});
    const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] = useState(false);
    const [verificationForm, setVerificationForm] = useState(false);
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const [helpText, setHelpText] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [open, setOpen] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [rememberMe, setRememberMe] = useState(false); // State for "Remember me?"
    const [loginErrorMessage, setLoginErrorMessage] = useState(''); // State to hold error message

    const navigate = useNavigate(); // Initialize navigate

    const handleTabChange = (event, newValue) => setActiveTab(newValue);
    const handleShowPasswordToggle = () => setShowPassword(!showPassword);
    const handleShowNewPasswordToggle = () => setShowNewPassword(!showNewPassword);

    const handleCloseDialog = () => {
        setOpen(false);
        setLoginValues({ username: '', password: '' });
        setSignupValues({ email: '', username: '', password: '', confirmPassword: '' });
        setLoginErrors({});
        setSignupErrors({});
    };

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    // Giả lập hai tài khoản: 1 customer và 1 staff
    const accounts = {
        customer: { username: 'customerUser', password: 'customerPass', role: 'customer' },
        staff: { username: 'staffUser', password: 'staffPass', role: 'staff' },
    };

    // Hàm kiểm tra thông tin đăng nhập và xác định vai trò
    const handleSuccessfulLogin = () => {
        const errors = {};
        if (!loginValues.username.trim()) {
            errors.username = 'Vui lòng nhập tên đăng nhập hoặc email';
        }
        if (!loginValues.password) {
            errors.password = 'Vui lòng nhập mật khẩu';
        }

        if (Object.keys(errors).length > 0) {
            setLoginErrors(errors);
            return;
        }

        // Giả lập quá trình kiểm tra tài khoản
        let role = '';
        if (
            loginValues.username === accounts.customer.username &&
            loginValues.password === accounts.customer.password
        ) {
            role = accounts.customer.role; // Đặt vai trò là customer
        } else if (
            loginValues.username === accounts.staff.username &&
            loginValues.password === accounts.staff.password
        ) {
            role = accounts.staff.role; // Đặt vai trò là staff
        } else {
            // Nếu tài khoản hoặc mật khẩu không đúng
            setLoginErrorMessage('Tên đăng nhập hoặc mật khẩu không đúng');
            return;
        }

        // Đăng nhập thành công, lưu vai trò vào localStorage
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', role); // Lưu vai trò vào localStorage

        handleCloseDialog();
        setLoginValues({ username: '', password: '' });
        setLoginErrors({});
        setLoginErrorMessage(''); // Clear error message on successful login

        // Navigate to the path after successful login
        navigate(routes.homePage);
    };

    const handleSendVerificationCode = () => {
        if (!validateEmail(email)) {
            setHelpText('Vui lòng nhập email đúng định dạng');
        } else {
            console.log("Verification code sent to:", email);
            setCodeSent(true);
            setHelpText('Mã xác minh đã được gửi đến email của bạn.');
            setCountdown(60); // Set countdown for 1 minute
        }
    };

    const handleVerifyCode = () => {
        if (!email || !verificationCode) {
            setHelpText('Vui lòng nhập cả email và mã xác minh.');
            return;
        }
        if (!validateEmail(email)) {
            setHelpText('Vui lòng nhập email đúng định dạng');
            return;
        }
        if (verificationCode === '123456') {  // Simulating correct verification code
            setVerificationForm(true);
            setHelpText('');
        } else {
            setHelpText('Mã xác minh không đúng.');
        }
    };

    const handleResetPassword = () => {
        if (!newPassword || !confirmPassword) {
            setHelpText('Vui lòng nhập cả mật khẩu mới và xác nhận mật khẩu.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setHelpText('Mật khẩu xác nhận không khớp');
        } else {
            console.log("Password successfully reset");
            setForgotPasswordDialogOpen(false);
        }
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSignup = () => {
        const errors = {};
        if (!signupValues.email?.trim()) {
            errors.email = 'Vui lòng nhập email';
        } else if (!validateEmail(signupValues.email)) {
            errors.email = 'Email không hợp lệ';
        }
        if (!signupValues.username.trim()) {
            errors.username = 'Vui lòng nhập tên đăng nhập';
        } else if (signupValues.username.length < 3 || signupValues.username.length > 20) {
            errors.username = 'Tên đăng nhập phải có từ 3 đến 20 ký tự';
        }
        if (!signupValues.password) {
            errors.password = 'Vui lòng nhập mật khẩu';
        } else if (signupValues.password.length < 6) {
            errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        if (signupValues.password !== signupValues.confirmPassword) {
            errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        if (Object.keys(errors).length > 0) {
            setSignupErrors(errors);
            return;
        }

        // Giả sử đăng ký thành công
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
        handleCloseDialog();
        setSignupValues({ email: '', username: '', password: '', confirmPassword: '' });
        setSignupErrors({});

        // Navigate to the path after successful signup
        navigate(routes.homePage);
    };

    const resetForgotPasswordForm = () => {
        setEmail('');
        setVerificationCode('');
        setNewPassword('');
        setConfirmPassword('');
        setVerificationForm(false);
        setCodeSent(false);
        setHelpText('');
    };

    const handleForgotPasswordDialogOpen = () => {
        setForgotPasswordDialogOpen(true);
        resetForgotPasswordForm();
    };

    const handleForgotPasswordDialogClose = () => {
        setForgotPasswordDialogOpen(false);
        resetForgotPasswordForm();
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ backgroundColor: '#f5f5f5' }}>
            <Box
                sx={{
                    width: '400px',
                    height: '600px', // Cố định chiều cao của Box ngoài
                    backgroundColor: 'white',
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    position: 'relative', // Đặt position relative để các thành phần con có thể sử dụng absolute
                }}
            >
                <Typography align="center" padding={0} pb={2} fontWeight="bold" fontSize={20}>
                    {activeTab === 0 ? 'Đăng nhập tài khoản' : 'Tạo tài khoản mới'}
                </Typography>
                <Tabs value={activeTab} onChange={handleTabChange} centered>
                    <Tab label="Đăng nhập" />
                    <Tab label="Đăng ký" />
                </Tabs>

                <Box sx={{ flexGrow: 1, mt: 2 }}>
                    {/* Form Đăng nhập */}
                    {activeTab === 0 && (
                        <Box>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Email/Username"
                                value={loginValues.username}
                                onChange={(e) => setLoginValues({ ...loginValues, username: e.target.value })}
                                error={Boolean(loginErrors.username)}
                                helperText={loginErrors.username}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={loginValues.password}
                                onChange={(e) => setLoginValues({ ...loginValues, password: e.target.value })}
                                error={Boolean(loginErrors.password)}
                                helperText={loginErrors.password}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleShowPasswordToggle}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 2 }}
                            />
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                    }
                                    label="Nhớ mật khẩu?"
                                />
                                <Link
                                    variant="body2"
                                    onClick={handleForgotPasswordDialogOpen}
                                    sx={{ cursor: 'pointer', marginLeft: '14px' }}
                                >
                                    Quên mật khẩu?
                                </Link>
                            </Box>
                            {/* Hiển thị thông báo lỗi đăng nhập */}
                            {loginErrorMessage && (
                                <Typography color="error">
                                    {loginErrorMessage}
                                </Typography>
                            )}
                        </Box>
                    )}

                    {/* Form Đăng ký */}
                    {activeTab === 1 && (
                        <Box>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Email"
                                value={signupValues.email}
                                onChange={(e) => setSignupValues({ ...signupValues, email: e.target.value })}
                                error={Boolean(signupErrors.email)}
                                helperText={signupErrors.email}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Username"
                                value={signupValues.username}
                                onChange={(e) => setSignupValues({ ...signupValues, username: e.target.value })}
                                error={Boolean(signupErrors.username)}
                                helperText={signupErrors.username}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={signupValues.password}
                                onChange={(e) => setSignupValues({ ...signupValues, password: e.target.value })}
                                error={Boolean(signupErrors.password)}
                                helperText={signupErrors.password}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleShowPasswordToggle}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Confirm Password"
                                type={showPassword ? 'text' : 'password'}
                                value={signupValues.confirmPassword}
                                onChange={(e) => setSignupValues({ ...signupValues, confirmPassword: e.target.value })}
                                error={Boolean(signupErrors.confirmPassword)}
                                helperText={signupErrors.confirmPassword}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleShowPasswordToggle}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 2 }}
                            />
                        </Box>
                    )}

                    {/* Nút hành động */}
                    <Box sx={{ position: 'absolute', bottom: 35, left: 16, right: 16 }}>
                        {activeTab === 0 ? (
                            <Button
                                onClick={handleSuccessfulLogin}
                                variant="contained"
                                color="inherit"
                                fullWidth
                                sx={{ py: 1.5, borderRadius: 3, bgcolor: 'var(--secondary-color)' }}
                            >
                                Đăng nhập
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSignup}
                                variant="contained"
                                fullWidth
                                sx={{ py: 1.5, borderRadius: 3, bgcolor: 'var(--secondary-color)' }}
                            >
                                Đăng ký
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Forgot Password Dialog */}
                <Dialog open={forgotPasswordDialogOpen} onClose={handleForgotPasswordDialogClose} maxWidth="xs">
                    <DialogTitle>Quên mật khẩu</DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '250px' }}>
                        {!verificationForm ? (
                            <Box sx={{ mt: 2, flexGrow: 1, marginTop: 2 }}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Nhập email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{ mb: 2, backgroundColor: '#F0F0F0', borderRadius: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Nhập mã xác minh"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Button
                                                    onClick={handleSendVerificationCode}
                                                    variant="text"
                                                    sx={{ color: 'var(--secondary-color)' }}
                                                    disabled={codeSent}
                                                >
                                                    {codeSent
                                                        ? `Gửi mã (${Math.floor(countdown / 60)}:${countdown % 60 < 10 ? '0' : ''}${countdown % 60})`
                                                        : 'Gửi mã'}
                                                </Button>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2, backgroundColor: '#F0F0F0', borderRadius: 2 }}
                                />
                                {helpText && <Typography color="error">{helpText}</Typography>}
                                <Button
                                    onClick={handleVerifyCode}
                                    variant="contained"
                                    sx={{ backgroundColor: 'var(--secondary-color)', color: 'black', mt: 2 }}
                                    fullWidth
                                >
                                    Xác minh mã
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ mt: 2, flexGrow: 1, marginTop: 2 }}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Mật khẩu mới"
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleShowNewPasswordToggle} edge="end">
                                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2, backgroundColor: '#F0F0F0', borderRadius: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Xác nhận mật khẩu"
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleShowNewPasswordToggle} edge="end">
                                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2, backgroundColor: '#F0F0F0', borderRadius: 2 }}
                                />
                                <Button
                                    onClick={handleResetPassword}
                                    variant="contained"
                                    sx={{ backgroundColor: 'var(--secondary-color)', color: 'black' }}
                                    fullWidth
                                >
                                    Đặt lại mật khẩu
                                </Button>
                                {helpText && <Typography color="error">{helpText}</Typography>}
                            </Box>
                        )}
                    </DialogContent>
                </Dialog>
                {/* Social Media Icons */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <IconButton color="primary" sx={{ marginRight: 1 }}>
                        <MailOutline />
                    </IconButton>
                    <IconButton color="primary">
                        <FacebookIcon />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

