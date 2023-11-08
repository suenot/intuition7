async ({ deep, require }) => {
  const React = require('react');
  const { Box, Text, Avatar, Wrap, Editable, EditablePreview, EditableInput, EditableTextarea, Icon } = require('@chakra-ui/react');
  const walletTypeId = await deep.id("@suenot/wallet", "Wallet");
  const assetTypeId = await deep.id("@suenot/asset", "Asset");
  const containAssetTypeId = await deep.id("@suenot/wallet", "ContainAsset");
  const asyncFileTypeId = await deep.id("@deep-foundation/core", "AsyncFile");
  const assetNameTypeId = await deep.id("@suenot/asset", "Name");
  const assetTickerTypeId = await deep.id("@suenot/asset", "Ticker");
  const assetAvatarTypeId = await deep.id("@suenot/asset", "Avatar");
  console.log({assetTypeId, containAssetTypeId, asyncFileTypeId, assetNameTypeId, assetTickerTypeId, assetAvatarTypeId});

  return ({ fillSize, style, link }) => {
    const amount = link?.value?.value || 0;
    const data = deep.useDeepQuery({
        _or: [
          // get async file
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
          // get avatar
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
          // get ticker
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
          // get name
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
          // contain assets
          {
            type_id: containAssetTypeId,
            to: {
              type_id: assetTypeId,
            },
            from: {
              type_id: walletTypeId
            }
          },
        ]
      }
    );
    const fileData = deep.minilinks.query({
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
    const avatarData = deep.minilinks.query({
      to: {
        type_id: assetTypeId,
        in: {
          type_id: containAssetTypeId,
          from_id: link.id
        }
      },
      type_id: assetAvatarTypeId
    });
    
    const file = fileData?.[0]?.id && `/api/file?linkId=${fileData?.[0]?.id}`;
    const avatar = avatarData?.[0]?.value?.value;
    // File has more priority than avatar (url)
    const src = file || avatar || "";
    console.log({data});
    console.log({fileData, file, name, ticker, avatarData, avatar, src});
    const amountFixed = typeof(amount) === 'number' ? amount.toFixed(8) : "";
    return <div>
      <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' p='4' backgroundColor='white'>
        <Icon />
        <Avatar size='2xl' name='' src={src} mb='1' />{' '}
        <Wrap>
          <Editable defaultValue='Name'>
            <EditablePreview />
            <EditableInput />
          </Editable>
          <Text>{name?.[0]?.value?.value}</Text>
          <Text>{amountFixed} {ticker?.[0]?.value?.value}</Text>
          <Editable defaultValue='Description'>
            <EditablePreview />
            <EditableTextarea />
          </Editable>
        </Wrap>
      </Box>
    </div>;
  }
}