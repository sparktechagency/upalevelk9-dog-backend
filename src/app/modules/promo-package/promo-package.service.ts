/* eslint-disable @typescript-eslint/ban-ts-comment */
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IPromoPackage } from './promo-package.interface';
import { PromoPackage } from './promo-package.model';

//! Admin Management Start
const addPromo = async (payload: IPromoPackage) => {
  const result = await PromoPackage.create(payload);
  return result;
};

const getPromos = async () => {
  const result = await PromoPackage.findOne({});
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
};
