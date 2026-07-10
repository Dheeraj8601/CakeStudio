using CakeStudio.Application.Common.Exceptions;
using CakeStudio.Application.DTOs.Address;
using CakeStudio.Application.Interfaces;
using CakeStudio.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Infrastructure.Services
{
    public class AddressService : IAddressService
    {
        private readonly IUserContext _userContext;
        private readonly IAddressRepository _repository;

        public AddressService(IUserContext userContext, IAddressRepository repository)
        {
            _userContext = userContext;
            _repository = repository;
        }
        public async Task CreateAsync(CreateAddressRequestDto request)
        {
            var currentUser =
                _userContext.GetCurrentUser();

            if (request.IsDefault)
            {
                var addresses =
                    await _repository.GetByUserIdAsync(
                        currentUser.UserId);

                foreach (var address in addresses)
                {
                    address.IsDefault = false;
                }

                await _repository.SaveChangesAsync();
            }

            await _repository.AddAsync(
                            new Address
                            {
                                UserId = currentUser.UserId,
                                FullName = request.FullName,
                                Mobile = request.Mobile,
                                Email = request.Email,
                                AddressLine1 = request.AddressLine1,
                                AddressLine2 = request.AddressLine2,
                                City = request.City,
                                State = request.State,
                                PostalCode = request.PostalCode,
                                Country = request.Country,
                                IsDefault = request.IsDefault
                            });
        }

        public async Task DeleteAsync(int addressId)
        {
            

            var currentUser =
                _userContext.GetCurrentUser();

            var address =
                await _repository.GetByIdAsync(addressId);

            if (address == null)
                throw new Exception("Address not found");

            if (address.UserId != currentUser.UserId)
                throw new Exception("Access denied");

            await _repository.DeleteAsync(address);
        }

        public async Task<List<AddressResponseDto>> GetMyAddressesAsync()
        {
            var currentUser =
                _userContext.GetCurrentUser();

            var addresses =
                await _repository.GetByUserIdAsync(
                    currentUser.UserId);

            return addresses.Select(x =>
                new AddressResponseDto
                {
                    AddressId = x.Id,
                    AddressLine1 = x.AddressLine1,
                    AddressLine2 = x.AddressLine2,
                    City = x.City,
                    State = x.State,
                    PostalCode = x.PostalCode,
                    Country = x.Country,
                    IsDefault = x.IsDefault,
                    FullName = x.FullName,
                    Mobile = x.Mobile,
                    Email = x.Email
                }).ToList();
        }

        public async Task SetDefaultAsync(int addressId)
        {
            var currentUser =
                _userContext.GetCurrentUser();

            var addresses =
                await _repository.GetByUserIdAsync(
                    currentUser.UserId);

            foreach (var item in addresses)
            {
                item.IsDefault = false;
            }

            var selected =
                addresses.FirstOrDefault(
                    x => x.Id == addressId);

            if (selected == null)
                throw new Exception("Address not found");

            selected.IsDefault = true;

            await _repository.SaveChangesAsync();
        }

        public async Task UpdateAsync(UpdateAddressRequestDto request)
        {
            var currentUser =
                _userContext.GetCurrentUser();

            var address =
                await _repository.GetByIdAsync(
                    request.AddressId);

            if (address == null)
                throw new Exception("Address not found");

            if (address.UserId != currentUser.UserId)
                throw new Exception("Access denied");

            if (request.IsDefault)
            {
                var addresses =
                    await _repository.GetByUserIdAsync(
                        currentUser.UserId);

                foreach (var item in addresses)
                {
                    item.IsDefault = false;
                }
            }

            address.FullName = request.FullName;

            address.Mobile = request.Mobile;

            address.Email = request.Email;

            address.AddressLine1 = request.AddressLine1;

            address.AddressLine2 = request.AddressLine2;

            address.City = request.City;

            address.State = request.State;

            address.PostalCode = request.PostalCode;

            address.Country = request.Country;

            address.IsDefault = request.IsDefault;

            await _repository.SaveChangesAsync();
        }
    }
}
