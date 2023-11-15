async ({ deep, require }) => {
  const React = require('react');
  const { useState, useEffect } = React;
  const AsyncFileId = await deep.idLocal("@deep-foundation/core", "AsyncFile");
  var UnitId = await deep.id("@suenot/unit", "Unit");
  var UnitNameId = await deep.id("@suenot/unit", "Name");
  var UnitTickerId = await deep.id("@suenot/unit", "Ticker");
  var UnitAvatarId = await deep.id("@suenot/unit", "Avatar");

  const WalletId = await deep.id("@suenot/wallet", "Wallet");
  const ContainUnitId = await deep.id("@suenot/wallet", "ContainUnit");
  const WalletAvatarId = await deep.id("@suenot/wallet", "Avatar");
  const WalletNameId = await deep.id("@suenot/wallet", "Name");

  const TransactionDescriptionId = await deep.id("@suenot/transaction", "Description");
  // const TransactionStatusId = await deep.id("@suenot/transaction", "Status");
  

  const { Box, Text, Avatar, Wrap, WrapItem, Editable, EditableInput, EditablePreview, Button } = require('@chakra-ui/react');
  return ({ fillSize, style, link }) => {

    const data = deep.useDeepSubscription({
      _or: [
        // get description for transaction
        {
          type_id: TransactionDescriptionId,
          to_id: link.id,
        },

        // get async file for wallet from
        {
          type_id: AsyncFileId,
          to: {
            type_id: WalletId,
            out: {
              from_id: link.id
            }
          },
        },
        // get async file for wallet to
        {
          type_id: AsyncFileId,
          to: {
            type_id: WalletId,
            in: {
              from_id: link.id
            }
          },
        },
        // get avatar for wallet from
        {
          type_id: WalletAvatarId,
          to: {
            type_id: WalletId,
            out: {
              from_id: link.id
            }
          },
        },
        // get avatar for wallet to
        {
          type_id: WalletAvatarId,
          to: {
            type_id: WalletId,
            in: {
              from_id: link.id
            }
          },
        },
      ]
    });

    const transactionDescriptionData = deep.minilinks.query({
      type_id: TransactionDescriptionId,
      to_id: link.id,
    });

    const walletFileFromData = deep.minilinks.query({
      type_id: AsyncFileId,
      to: {
        type_id: WalletId,
        out: {
          from_id: link.id
        }
      }
    });

    const walletFileToData = deep.minilinks.query({
      type_id: AsyncFileId,
      to: {
        type_id: WalletId,
        in: {
          from_id: link.id
        }
      },
    });
    const walletAvatarFromData = deep.minilinks.query({
      type_id: WalletAvatarId,
      to: {
        type_id: WalletId,
        out: {
          from_id: link.id
        }
      }
    });
    const walletAvatarToData = deep.minilinks.query({
      type_id: WalletAvatarId,
      to: {
        type_id: WalletId,
        in: {
          from_id: link.id
        }
      }
    });
    console.log({transactionDescriptionData, walletFileFromData, walletFileToData, walletAvatarFromData, walletAvatarToData})

    const amount = link?.value?.value || 0;
    const amountFixed = typeof(amount) === 'number' ? amount.toFixed(8) : "";

    const [transactionAmount, setTransactionAmount] = useState(amountFixed);
    return <div>
      <Box maxW='sm' minW='sm' w='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' p='4' backgroundColor='white'>
        <Text textAlign="center">Transaction #{link.id}</Text>
        <Text>From: #{link?.from_id}</Text>
        <Text>To: #{link?.to_id}</Text>
        <Editable placeholder="Amount: " value={transactionAmount} isDisabled={true}>
          <EditablePreview w={'100%'} />
          <EditableInput />
        </Editable>
        <Text>Description: -</Text>
        <Text>Status: Empty (Await) | Empty amount | Pending | Complete | Failed</Text>
        <br />
        <Button colorScheme='teal' size='md' variant='outline' onClick={async () => {}}>
          Send
        </Button>
      </Box>
    </div>;
  }
}