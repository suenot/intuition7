async ({ deep, require }) => {
  const React = require('react');
  const { Box, Text, Avatar, Wrap, Editable, EditablePreview, EditableInput, EditableTextarea, Icon, Flex, Spacer } = require('@chakra-ui/react');
  const walletTypeId = await deep.id("@suenot/wallet", "Wallet");
  const containAssetTypeId = await deep.id("@suenot/wallet", "ContainAsset");
  const walletAvatarTypeId = await deep.id("@suenot/wallet", "Avatar");
  const walletDescriptionTypeId = await deep.id("@suenot/wallet", "Description");
  const walletNameTypeId = await deep.id("@suenot/wallet", "Name");

  const assetTypeId = await deep.id("@suenot/asset", "Asset");
  const asyncFileTypeId = await deep.id("@deep-foundation/core", "AsyncFile");
  const assetNameTypeId = await deep.id("@suenot/asset", "Name");
  const assetTickerTypeId = await deep.id("@suenot/asset", "Ticker");
  const assetAvatarTypeId = await deep.id("@suenot/asset", "Avatar");
  console.log({assetTypeId, containAssetTypeId, asyncFileTypeId, assetNameTypeId, assetTickerTypeId, assetAvatarTypeId, walletTypeId});

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
          // Wallet contain assets
          {
            type_id: containAssetTypeId,
            to: {
              type_id: assetTypeId,
            },
            from: {
              type_id: walletTypeId
            }
          },


          // get async file for Asset
          {
            type_id: asyncFileTypeId,
            to: {
              type_id: assetTypeId,
              in: {
                type_id: containAssetTypeId,
                from_id: link.id
              }
            },
          },
          // get avatar for Asset
          {
            type_id: assetAvatarTypeId,
            to: {
              type_id: assetTypeId,
              in: {
                type_id: containAssetTypeId,
                from_id: link.id
              }
            },
          },
          // get ticker for Asset
          {
            type_id: assetTickerTypeId,
            to: {
              type_id: assetTypeId,
              in: {
                type_id: containAssetTypeId,
                from_id: link.id
              }
            },
          },
          // get name for Asset
          {
            type_id: assetNameTypeId,
            to: {
              type_id: assetTypeId,
              in: {
                type_id: containAssetTypeId,
                from_id: link.id
              }
            },
          },
        ]
      }
    );

    const assetFileData = deep.minilinks.query({
      to: {
        type_id: assetTypeId,
        in: {
          type_id: containAssetTypeId,
          from_id: link.id
        }
      },
      type_id: asyncFileTypeId
    });

    const ticker = deep.minilinks.query({
      to: {
        type_id: assetTypeId,
        in: {
          type_id: containAssetTypeId,
          from_id: link.id
        }
      },
      type_id: assetTickerTypeId
    });
    const assetAvatarData = deep.minilinks.query({
      to: {
        type_id: assetTypeId,
        in: {
          type_id: containAssetTypeId,
          from_id: link.id
        }
      },
      type_id: assetAvatarTypeId
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


    
    const assetFile = assetFileData?.[0]?.id && `/api/file?linkId=${assetFileData?.[0]?.id}`;
    const assetAvatar = assetAvatarData?.[0]?.value?.value;

    const walletFile = walletFileData?.[0]?.id && `/api/file?linkId=${walletFileData?.[0]?.id}`;
    const walletAvatar = walletAvatarData?.[0]?.value?.value;

    // File has more priority than avatar (url)
    const assetSrc = assetFile || assetAvatar || "";
    const walletSrc = walletFile || walletAvatar || "";
    const src = walletSrc || assetSrc || "";
    
    console.log({data});
    console.log({assetFileData, assetFile, ticker, assetAvatarData, assetAvatar, assetSrc, walletFileData, walletFile, walletAvatarData, walletAvatar, walletSrc, src});
    const amountFixed = typeof(amount) === 'number' ? amount.toFixed(8) : "";
    return <div>
      <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' p='4' backgroundColor='white'>
        
        <Avatar size='2xl' name='' src={src} mb='1' />

        <Editable defaultValue='Name' style={{flex: '1 0 auto'}}>
          <EditablePreview />
          <EditableInput />
        </Editable>
        <Text size="sm">{walletNameData?.[0]?.value?.value}</Text>
        <Text>{amountFixed} {ticker?.[0]?.value?.value} <Avatar size='sm' name='' src={assetSrc} mb='1' /></Text>
        <Editable defaultValue={walletDescriptionData?.[0]?.value?.value}>
          <EditablePreview />
          <EditableTextarea />
        </Editable>

      </Box>
    </div>;
  }
}