# Install websocat
#cargo install --features=ssl websocat

##{"projectName":"testing1"}
##{"projectName":"testing2"}

# command='./create.sh'
# time seq 100 | parallel -n0 -j10 $command 2>&1 | tee test_results.txt

#Build
# command='./build.sh'
# seq 100 | parallel -n0 -j5 $command 2>&1 | tee test_results.txt

time ./build.sh

#websocat wss://server.staging.ink-remix.blockchain-it.hr/build
##{"projectId":"96911738-be49-4496-84c6-f79a9ede8981","projectName":"testing","lib":"#![feature(proc_macro_hygiene)]\n#![cfg_attr(not(feature = \"std\"), no_std)]\n\nuse ink_core::storage;\nuse ink_lang2 as ink;\n\n#[ink::contract(version = \"0.1.0\")]\nmod testing {\n    #[ink(storage)]\n    struct Testing {\n        value: storage::Value<bool>,\n    }\n\n    impl Testing {\n        #[ink(constructor)]\n        fn new(&mut self, init_value: bool) {\n            self.value.set(init_value);\n        }\n\n        #[ink(constructor)]\n        fn default(&mut self) {\n            self.new(false)\n        }\n\n        #[ink(message)]\n        fn flip(&mut self) {\n            *self.value = !self.get();\n        }\n\n        #[ink(message)]\n        fn get(&self) -> bool {\n            *self.value\n        }\n    }\n\n    #[cfg(test)]\n    mod tests {\n        use super::*;\n\n        #[test]\n        fn default_works() {\n            let testing = Testing::default();\n            assert_eq!(testing.get(), false);\n        }\n\n        #[test]\n        fn it_works() {\n            let mut testing = Testing::new(false);\n            assert_eq!(testing.get(), false);\n            testing.flip();\n            assert_eq!(testing.get(), true);\n        }\n    }\n}\n","cargo":"[package]\nname = \"testing\"\nversion = \"0.1.0\"\nauthors = [\"[your_name] <[your_email]>\"]\nedition = \"2018\"\n\n[dependencies]\nink_abi = { git = \"https://github.com/paritytech/ink\", package = \"ink_abi\", default-features = false, features = [\"derive\"], optional = true }\nink_core = { git = \"https://github.com/paritytech/ink\", package = \"ink_core\", default-features = false }\nink_lang2 = { git = \"https://github.com/paritytech/ink\", package = \"ink_lang2\", default-features = false }\n\nscale = { package = \"parity-scale-codec\", version = \"1.1\", default-features = false, features = [\"derive\"] }\ntype-metadata = { git = \"https://github.com/type-metadata/type-metadata.git\", default-features = false, features = [\"derive\"], optional = true }\n\n[lib]\nname = \"testing\"\npath = \"lib.rs\"\ncrate-type = [\n\t# Used for normal contract Wasm blobs.\n\t\"cdylib\",\n\t# Used for ABI generation.\n\t\"rlib\",\n]\n\n[features]\ndefault = [\"test-env\"]\nstd = [\n    \"ink_abi/std\",\n    \"ink_core/std\",\n    \"scale/std\",\n    \"type-metadata/std\",\n]\ntest-env = [\n    \"std\",\n    \"ink_core/test-env\",\n    \"ink_lang2/test-env\",\n]\nink-generate-abi = [\n    \"std\",\n    \"ink_abi\",\n    \"type-metadata\",\n    \"ink_core/ink-generate-abi\",\n    \"ink_lang2/ink-generate-abi\",\n]\nink-as-dependency = []\n\n[profile.release]\npanic = \"abort\"\nlto = true\nopt-level = \"z\"\noverflow-checks = true\n\n[workspace]\nmembers = [\n\t\".ink/abi_gen\"\n]\nexclude = [\n\t\".ink\"\n]\n","createdAt":"Thursday, December 26, 2019"}
