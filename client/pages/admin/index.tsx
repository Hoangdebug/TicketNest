import { withAuth } from '@utils/hocs';
import React, { useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    LinearProgress,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/system';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { FaChartLine, FaChartBar, FaTable, FaFilter } from 'react-icons/fa';

ChartJS.register(...registerables);

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    //   color: theme.palette.primary.main
}));

const AdminPages: React.FC = (props) => {
    const {} = props;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [sortColumn, setSortColumn] = useState('revenue');
    const [sortDirection, setSortDirection] = useState('desc');

    const monthlyData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Sales',
                data: [12000, 19000, 15000, 22000, 18000, 25000],
                // borderColor: theme.palette.primary.main,
                tension: 0.4,
            },
        ],
    };
    const regionalData = {
        labels: ['North', 'South', 'East', 'West'],
        datasets: [
            {
                label: 'Sales',
                data: [45000, 38000, 42000, 50000],
                // backgroundColor: theme.palette.secondary.main
            },
        ],
    };

    const products = [
        { id: 1, name: 'Product A', revenue: 50000, unitsSold: 1000, profitMargin: 0.3 },
        { id: 2, name: 'Product B', revenue: 75000, unitsSold: 1500, profitMargin: 0.35 },
        { id: 3, name: 'Product C', revenue: 60000, unitsSold: 1200, profitMargin: 0.28 },
        { id: 4, name: 'Product D', revenue: 40000, unitsSold: 800, profitMargin: 0.32 },
        { id: 5, name: 'Product E', revenue: 55000, unitsSold: 1100, profitMargin: 0.33 },
    ];

    const sortedProducts = products.sort((a, b) => {
        if (sortDirection === 'asc') {
            return a[sortColumn] - b[sortColumn];
        } else {
            return b[sortColumn] - a[sortColumn];
        }
    });

    const handleSort = (column: any) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('desc');
        }
    };

    const pipelineStages = [
        { name: 'Leads', value: 100 },
        { name: 'Qualified', value: 70 },
        { name: 'Proposal', value: 40 },
        { name: 'Negotiation', value: 20 },
        { name: 'Closed', value: 10 },
    ];

    return (
        <Container maxWidth="lg">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom={true} align="center">
                    Sales Event Manager
                </Typography>
                <Grid container={true} spacing={3}>
                    <Grid item={true} xs={12} md={6}>
                        <StyledPaper>
                            <SectionTitle variant="h6">
                                <FaChartLine /> Monthly Sales Trend
                            </SectionTitle>
                            <Box height={300}>
                                <Line
                                    data={monthlyData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            tooltip: {
                                                mode: 'index',
                                                intersect: false,
                                            },
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                title: {
                                                    display: true,
                                                    text: 'Sales ($)',
                                                },
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        </StyledPaper>
                    </Grid>
                    <Grid item={true} xs={12} md={6}>
                        <StyledPaper>
                            <SectionTitle variant="h6">
                                <FaChartBar /> Regional Sales Comparison
                            </SectionTitle>
                            <Box height={300}>
                                <Bar
                                    data={regionalData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            tooltip: {
                                                mode: 'index',
                                                intersect: false,
                                            },
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                title: {
                                                    display: true,
                                                    text: 'Sales ($)',
                                                },
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        </StyledPaper>
                    </Grid>
                    <Grid item={true} xs={12}>
                        <StyledPaper>
                            <SectionTitle variant="h6">
                                <FaTable /> Top Product Performance
                            </SectionTitle>
                            <TableContainer>
                                <Table aria-label="Top products table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Product Name</TableCell>
                                            <TableCell
                                                sortDirection={((sortColumn === 'revenue' ? sortDirection : false) as boolean) ?? undefined}
                                            >
                                                <TableSortLabel
                                                    active={sortColumn === 'revenue'}
                                                    direction={sortColumn === 'revenue' ? sortDirection : 'asc'}
                                                    onClick={() => handleSort('revenue')}
                                                >
                                                    Revenue
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell sortDirection={sortColumn === 'unitsSold' ? sortDirection : false}>
                                                <TableSortLabel
                                                    active={sortColumn === 'unitsSold'}
                                                    direction={sortColumn === 'unitsSold' ? sortDirection : 'asc'}
                                                    onClick={() => handleSort('unitsSold')}
                                                >
                                                    Units Sold
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell sortDirection={sortColumn === 'profitMargin' ? sortDirection : false}>
                                                <TableSortLabel
                                                    active={sortColumn === 'profitMargin'}
                                                    direction={sortColumn === 'profitMargin' ? sortDirection : 'asc'}
                                                    onClick={() => handleSort('profitMargin')}
                                                >
                                                    Profit Margin
                                                </TableSortLabel>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sortedProducts.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>{product.name}</TableCell>
                                                <TableCell>${product.revenue.toLocaleString()}</TableCell>
                                                <TableCell>{product.unitsSold.toLocaleString()}</TableCell>
                                                <TableCell>{(product.profitMargin * 100).toFixed(2)}%</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </StyledPaper>
                    </Grid>
                    <Grid item={true} xs={12}>
                        <StyledPaper>
                            <SectionTitle variant="h6">
                                <FaFilter /> Sales Pipeline
                            </SectionTitle>
                            <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-between">
                                {pipelineStages.map((stage, index) => (
                                    <Box key={stage.name} width={isMobile ? '100%' : '18%'} mb={isMobile ? 2 : 0}>
                                        <Typography variant="body2" gutterBottom={true}>
                                            {stage.name}
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(stage.value / pipelineStages[0].value) * 100}
                                            sx={{
                                                height: 20,
                                                borderRadius: 5,
                                                backgroundColor: theme.palette.grey[300],
                                                '& .MuiLinearProgress-bar': {
                                                    borderRadius: 5,
                                                    backgroundColor: theme.palette.primary.main,
                                                },
                                            }}
                                        />
                                        <Typography variant="body2" align="right" mt={1}>
                                            {stage.value}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </StyledPaper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default withAuth(AdminPages);
