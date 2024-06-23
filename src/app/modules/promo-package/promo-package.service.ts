/* eslint-disable @typescript-eslint/ban-ts-comment */
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IPromoPackage } from './promo-package.interface';
import { PromoCode, PromoPackage } from './promo-package.model';

const addPromo = async (payload: IPromoPackage) => {
  const result = await PromoPackage.create(payload);
  return result;
};
const addPromoCode = async (payload: { code: string }) => {
  const isExist = await PromoCode.findOne({ code: payload.code });
  if (isExist) {
    throw new ApiError(httpStatus.ALREADY_REPORTED, 'Promo Code Already Exist');
  }
  const result = await PromoCode.create(payload);
  return result;
};

const getPromos = async () => {
  const result = await PromoPackage.findOne({});
  return result;
};
const getPromoCodes = async () => {
  const result = await PromoCode.find({});
  return result;
};

const updatePromoPackage = async (id: string, payload: IPromoPackage) => {
  const isExistPromoPackage = await PromoPackage.findById(id);
  if (!isExistPromoPackage) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Promo Package doesn't exist!");
  }
  const result = await PromoPackage.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deletePromos = async (id: string) => {
  const check = await PromoPackage.findById(id);
  if (!check) {
    throw new ApiError(404, 'Promo not found');
  }
  return await PromoPackage.findByIdAndDelete(id);
};

export const PromosPlanService = {
  addPromo,
  getPromos,
  deletePromos,
  updatePromoPackage,
  addPromoCode,
  getPromoCodes,
};
