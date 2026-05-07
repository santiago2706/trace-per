#![cfg(test)]
use super::*;
use soroban_sdk::{Env, String};

#[test]
fn test() {
    let env = Env::default();
    let contract_id = env.register_contract(None, LotVerificationContract);
    let client = LotVerificationContractClient::new(&env, &contract_id);

    let lot_id = String::from_str(&env, "LOT-001");
    
    assert_eq!(client.is_verified(&lot_id), false);
    
    client.register_lot(&lot_id);
    
    assert_eq!(client.is_verified(&lot_id), true);
}
