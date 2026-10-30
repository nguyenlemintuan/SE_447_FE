<template>
    <div class="wrapper">
        <div class="authentication-forgot d-flex align-items-center justify-content-center">
            <div class="card forgot-box">
                <div class="card-body">
                    <div class="p-4 rounded border">
                        <div class="text-center">
                            <img src="../../../assets/images/icons/forgot-2.png" width="120" alt="">
                        </div>
                        <h4 class="mt-5 font-weight-bold">Forgot Password?</h4>
                        <p class="text-muted">Enter your registered email ID to reset the password</p>
                        <div class="my-4">
                            <label class="form-label">Email id</label>
                            <input type="text" class="form-control form-control-lg" placeholder="example@user.com">
                        </div>
                        <div class="d-grid gap-2">
                            <button type="button" class="btn btn-primary btn-lg">Send</button>
                            <a href="../../../authentication-signin.html" class="btn btn-light btn-lg">
                                <i class="bx bx-arrow-back me-1"></i>Back to Login
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('https://img.freepik.com/free-photo/3d-rendering-hexagonal-texture-background_23-2150796421.jpg?t=st=1741321732~exp=1741325332~hmac=f0c834c679a5452e7350724eddccb6eb9c48403fda1ef39b976ab98cdaffe827&w=1800') 
        no-repeat center center;
    background-size: cover;
    z-index: -1;
}

</style>
