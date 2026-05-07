#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Env, Symbol, String};

#[contract]
pub struct LotVerificationContract;

#[contractimpl]
impl LotVerificationContract {
    /// Registers a lot as verified on-chain.
    /// In a real app, this might require a specific admin/producer signature.
    pub fn register_lot(env: Env, lot_id: String) {
        // Store the verification status using the lot_id as the key
        // We use a simple Symbol for the verification state
        let key = symbol_short!("verified");
        
        // We store it in persistent storage
        // A more advanced version would use a Map, but for MVP we use the lot_id as part of the key
        // or store it in a way that is queryable.
        // For simplicity: DataKey::Lot(lot_id)
        env.storage().persistent().set(&lot_id, &true);
    }

    /// Checks if a lot has been verified on-chain.
    pub fn is_verified(env: Env, lot_id: String) -> bool {
        env.storage().persistent().get(&lot_id).unwrap_or(false)
    }
}

mod test;
