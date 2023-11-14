async ({ deep, require }) => {
  const React = require('react');
  const { Box, Text, Avatar, Wrap, Editable, EditablePreview, EditableInput, EditableTextarea, Icon, Flex, Spacer } = require('@chakra-ui/react');
  const walletTypeId = await deep.id("@suenot/wallet", "Wallet");
  const containUnitTypeId = await deep.id("@suenot/wallet", "ContainUnit");
  const walletAvatarTypeId = await deep.id("@suenot/wallet", "Avatar");
  const walletDescriptionTypeId = await deep.id("@suenot/wallet", "Description");
  const walletNameTypeId = await deep.id("@suenot/wallet", "Name");

  const unitTypeId = await deep.id("@suenot/unit", "Unit");
  const asyncFileTypeId = await deep.id("@deep-foundation/core", "AsyncFile");
  const unitNameTypeId = await deep.id("@suenot/unit", "Name");
  const unitTickerTypeId = await deep.id("@suenot/unit", "Ticker");
  const unitAvatarTypeId = await deep.id("@suenot/unit", "Avatar");
  console.log({unitTypeId, containUnitTypeId, asyncFileTypeId, unitNameTypeId, unitTickerTypeId, unitAvatarTypeId, walletTypeId});

  return ({ fillSize, style, link }) => {
    const amount = link?.value?.value || 0;
    const data = deep.useDeepQuery({
        _or: [
          // get async file for Wallet
          {
            type_id: asyncFileTypeId,
            to_id: link.id,
          },
          // get avatar for Wallet
          {
            type_id: walletAvatarTypeId,
            to_id: link.id,
          },
          // get description for Wallet
          {
            type_id: walletDescriptionTypeId,
            to_id: link.id,
          },
          // get name for Wallet
          {
            type_id: walletNameTypeId,
            to_id: link.id,
          },
          // Wallet contain units
          {
            type_id: containUnitTypeId,
            to: {
              type_id: unitTypeId,
            },
            from: {
              type_id: walletTypeId
            }
          },


          // get async file for Unit
          {
            type_id: asyncFileTypeId,
            to: {
              type_id: unitTypeId,
              in: {
                type_id: containUnitTypeId,
                from_id: link.id
              }
            },
          },
          // get avatar for Unit
          {
            type_id: unitAvatarTypeId,
            to: {
              type_id: unitTypeId,
              in: {
                type_id: containUnitTypeId,
                from_id: link.id
              }
            },
          },
          // get ticker for Unit
          {
            type_id: unitTickerTypeId,
            to: {
              type_id: unitTypeId,
              in: {
                type_id: containUnitTypeId,
                from_id: link.id
              }
            },
          },
          // get name for Unit
          {
            type_id: unitNameTypeId,
            to: {
              type_id: unitTypeId,
              in: {
                type_id: containUnitTypeId,
                from_id: link.id
              }
            },
          },
        ]
      }
    );

    const unitFileData = deep.minilinks.query({
      to: {
        type_id: unitTypeId,
        in: {
          type_id: containUnitTypeId,
          from_id: link.id
        }
      },
      type_id: asyncFileTypeId
    });

    const ticker = deep.minilinks.query({
      to: {
        type_id: unitTypeId,
        in: {
          type_id: containUnitTypeId,
          from_id: link.id
        }
      },
      type_id: unitTickerTypeId
    });
    const unitAvatarData = deep.minilinks.query({
      to: {
        type_id: unitTypeId,
        in: {
          type_id: containUnitTypeId,
          from_id: link.id
        }
      },
      type_id: unitAvatarTypeId
    });

    const walletAvatarData = deep.minilinks.query({
      type_id: walletAvatarTypeId,
      to_id: link.id,
    })

    const walletNameData = deep.minilinks.query({
      type_id: walletNameTypeId,
      to_id: link.id,
    })

    const walletDescriptionData = deep.minilinks.query({
      type_id: walletDescriptionTypeId,
      to_id: link.id,
    })

    const walletFileData = deep.minilinks.query({
      type_id: asyncFileTypeId,
      to_id: link.id,
    })


    
    const unitFile = unitFileData?.[0]?.id && `/api/file?linkId=${unitFileData?.[0]?.id}`;
    const unitAvatar = unitAvatarData?.[0]?.value?.value;

    const walletFile = walletFileData?.[0]?.id && `/api/file?linkId=${walletFileData?.[0]?.id}`;
    const walletAvatar = walletAvatarData?.[0]?.value?.value;

    // File has more priority than avatar (url)
    const unitSrc = unitFile || unitAvatar || "";
    const walletSrc = walletFile || walletAvatar || "";
    const src = walletSrc || unitSrc || "";
    
    console.log({data});
    console.log({unitFileData, unitFile, ticker, unitAvatarData, unitAvatar, unitSrc, walletFileData, walletFile, walletAvatarData, walletAvatar, walletSrc, src});
    const amountFixed = typeof(amount) === 'number' ? amount.toFixed(8) : "";
    return <div>
      <Box maxW='sm' minW='sm' w='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' p='4' backgroundColor='white'>
        
        <Avatar size='2xl' name='' src={src} mb='1' />

        <Editable defaultValue={walletNameData?.[0]?.value?.value} style={{flex: '1 0 auto'}}>
          <EditablePreview />
          <EditableInput />
        </Editable>
        <Text>{amountFixed} {ticker?.[0]?.value?.value} <Avatar size='sm' name='' src={unitSrc} mb='1' /></Text>
        <Editable defaultValue={walletDescriptionData?.[0]?.value?.value}>
          <EditablePreview />
          <EditableTextarea />
        </Editable>

      </Box>
    </div>;
  }
}