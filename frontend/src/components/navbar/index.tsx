import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../../api/auth.api";
import LOGO_PATH from "../../assets/images/placement-840x450.jpg";
import "./style.css";
import { setUser } from "../../store/user/userReducer";
import { pages, settings } from "../../services/constants";
import { IconType } from "react-icons";
import notification from "../../configs/notification";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.userReducer);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (page: {
    name: string;
    url: string | null;
    Icon?: IconType;
  }) => {
    if (page.url !== null) {
      navigate(page.url);
    } else if (page.name === "Download Result") {
      const apiUrl = `${import.meta.env.VITE_BASE_URL}/result/download`; // Replace with your actual API endpoint
      window.open(apiUrl, "_blank");
    }
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClick = async (value: { name: string; url: string | null }) => {
    if (value.url !== null) {
      navigate(value.url);
    } else if (value.name === "Logout") {
      try {
        await signout();
        dispatch(setUser(null));
        navigate("/signin");
      } catch (error) {
        if (error instanceof Error) {
          console.log("error.message", error.message);
          notification.error(error.message);
        }
      }
    }
    handleCloseUserMenu();
  };

  const showNavbarOption = (isPrivate: boolean) => {
    return isPrivate ? user !== null : user === null;
  };

  return (
    <AppBar
      position="fixed"
      sx={{ height: "65px", backgroundColor: "#000043" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Avatar
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            alt="Logo"
            src={LOGO_PATH}
          />
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "white",
              textDecoration: "none",
            }}
          >
            <Link to="/" className="logo-text">
              Placement Cell
            </Link>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map(({ name, Icon, url }) => (
                <React.Fragment key={name}>
                  <MenuItem
                    key={name}
                    onClick={() => handleCloseNavMenu({ name, Icon, url })}
                  >
                    {Icon ? <Icon /> : null}
                    <Typography textAlign="center">{name}</Typography>
                  </MenuItem>
                </React.Fragment>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />

          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            <Link to="/" className="logo-text">
              Physio
            </Link>
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              justifyContent: "flex-end",
              display: { xs: "none", md: "flex" },
            }}
          >
            {pages.map(({ name, Icon, url, privateURL }) =>
              showNavbarOption(privateURL) ? (
                <React.Fragment key={name}>
                  <Button
                    key={name}
                    onClick={() => handleCloseNavMenu({ name, Icon, url })}
                    sx={{
                      my: 2,
                      color: "white",
                      display: "flex",
                      mr: 2,
                      gap: "5px",
                    }}
                  >
                    {Icon ? <Icon style={{ fontSize: "18px" }} /> : null}
                    {name}
                  </Button>
                </React.Fragment>
              ) : null
            )}
          </Box>
          {user && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Click">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={user.name} src={""}>
                    {user.name.split("")[0]}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.name}
                    onClick={() => handleClick(setting)}
                  >
                    <Typography textAlign="center">{setting.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
