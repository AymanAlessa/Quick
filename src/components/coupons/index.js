import React, { useEffect, useState } from "react";
import useGetCoupons from "../../api-manage/hooks/react-query/useGetCoupons";
import { Box, Stack } from "@mui/system";
import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import CustomEmptyResult from "../custom-empty-result";
import nodataimage from "../../../public/static/nodata.png";
import Coupon from "./Coupon";
import CustomShimmerCard from "./Shimmer";
import { t } from "i18next";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { useGetCouponLists } from "api-manage/hooks/react-query/useCouponsLists";

const Coupons = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [copy, setCopy] = useState(null);

  const {
    data: rentalCouponData,
    refetch: rentalCouponRefetch,
    isLoading: isRentalCouponLoading,
    isFetching: isRentalCouponFetching,
  } = useGetCouponLists();
  const { data, refetch, isLoading, isFetching } = useGetCoupons();

  const isRentalModule = getCurrentModuleType() === "rental";

  useEffect(() => {
    if (isRentalModule) {
      rentalCouponRefetch();
    } else {
      refetch();
    }
  }, []);

  const couponData = isRentalModule ? rentalCouponData ?? [] : data ?? [];
  const isCouponLoading = isRentalModule ? isRentalCouponLoading : isLoading;
  const isCouponFetching = isRentalModule ? isRentalCouponFetching : isFetching;

  return (
    <Box
      mt={{ xs: "1rem", md: "2rem" }}
      minHeight="60vh"
      paddingLeft={{ xs: "10px", sm: "20px", md: "25px" }}
      paddingRight={{ xs: "10px", sm: "20px", md: "40px" }}
    >
      <Grid container spacing={2}>
        {isSmall && (
          <Grid item xs={12}>
            {isSmall && (
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  textTransform="capitalize"
                  fontWeight="700"
                  fontSize="16px"
                >
                  {t("Coupons")}
                </Typography>
                {/*<InfoOutlinedIcon />*/}
              </Stack>
            )}
          </Grid>
        )}
        {couponData &&
          couponData?.length > 0 &&
          couponData?.map((coupon, index) => {
            return (
              <Grid item sm={6} xs={12} md={4} key={index}>
                <Coupon
                  coupon={coupon}
                  isLoading={isLoading}
                  setCopy={setCopy}
                  copy={copy}
                />
              </Grid>
            );
          })}
        {couponData && !isCouponFetching && couponData.length === 0 && (
          <CustomEmptyResult label="No Coupon Found" image={nodataimage} />
        )}
        {(isCouponLoading || isCouponFetching) && <CustomShimmerCard />}
      </Grid>
    </Box>
  );
};

Coupons.propTypes = {};

export default Coupons;
