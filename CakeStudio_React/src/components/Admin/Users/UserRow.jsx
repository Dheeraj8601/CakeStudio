import {
    IconButton,
    TableCell,
    TableRow,
    Tooltip,
    Typography,
    Box,
    Chip
} from "@mui/material";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import UserStatusSwitch from "./UserStatusSwitch";

import "./UserRow.css";

export default function UserRow({

    user,

    onDelete,

    onStatusChange

}) {

    return (

        <TableRow hover>

            <TableCell>

                <Typography className="user-id">

                    #{user.id}

                </Typography>

            </TableCell>

            <TableCell>

                <Box className="customer-info">

                    <Typography className="customer-name">

                        {user.fullName}

                    </Typography>

                    <Typography className="customer-email">

                        {user.email}

                    </Typography>

                </Box>

            </TableCell>

            <TableCell>

                <Typography className="customer-mobile">

                    { !user.mobile ? '-' : user.mobile}

                </Typography>

            </TableCell>

            <TableCell align="center">

                {user.joinedOn}

            </TableCell>

            <TableCell align="center">

                <UserStatusSwitch

                    checked={user.status}

                    onChange={(checked) =>

                        onStatusChange(

                            user.id,

                            checked

                        )

                    }

                />

            </TableCell>

            <TableCell align="center">

                <Tooltip title="Delete User">

                    <IconButton

                        className="delete-user-btn"

                        onClick={() => onDelete(user)}

                    >

                        <DeleteOutlineOutlinedIcon />

                    </IconButton>

                </Tooltip>

            </TableCell>

        </TableRow>

    );

}