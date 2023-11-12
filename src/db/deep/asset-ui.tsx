async ({ deep, require }) => {
  const React = require('react');
  const { useState, useEffect } = React;
  const { Box, Text, Avatar, Wrap, WrapItem, Editable, EditablePreview, EditableInput, EditableTextarea, Center, Flex, Divider } = require('@chakra-ui/react');
  const AsyncFileId = await deep.idLocal("@deep-foundation/core", "AsyncFile");

  // const ContainId = await deep.idLocal("@deep-foundation/core", "Contain");
  var AssetNameId = deep.id("@suenot/asset", "Name");
  var AssetDescriptionId = await deep.id("@suenot/asset", "Description");
  var AssetTickerId = await deep.id("@suenot/asset", "Ticker");
  var AssetAvatarId = await deep.id("@suenot/asset", "Avatar");
  
  return ({ fillSize, style, link }) => {

    const data = deep.useDeepSubscription({
        _or: [
          {
            to_id: link.id,
            type_id: { _id: ["@deep-foundation/core", "AsyncFile"] }
          },
          {
            to_id: link.id,
            type_id: { _id: ["@suenot/asset", "Name"] }
          },
          {
            to_id: link.id,
            type_id: { _id: ["@suenot/asset", "Description"] }
          },
          {
            to_id: link.id,
            type_id: { _id: ["@suenot/asset", "Ticker"] }
          },
          {
            to_id: link.id,
            type_id: { _id: ["@suenot/asset", "Avatar"] }
          }
        ]
      }
    );
    const fileData = deep.minilinks.query({
      to_id: link.id,
      type_id: AsyncFileId
    });
    const nameData = deep.minilinks.query({
      to_id: link.id,
      type_id: AssetNameId
    });
    const assetDescriptionData = deep.minilinks.query({
      to_id: link.id,
      type_id: AssetDescriptionId
    });
    const tickerData = deep.minilinks.query({
      to_id: link.id,
      type_id: AssetTickerId
    });
    const avatarData = deep.minilinks.query({
      to_id: link.id,
      type_id: AssetAvatarId
    });



    const assetFileValue = fileData?.[0]?.id && `/api/file?linkId=${fileData?.[0]?.id}`;
    const assetAvatarValue = avatarData?.[0]?.value?.value;
    const assetAvatarId = avatarData?.[0]?.id;
    // File has more priority than avatar (url)
    const assetSrcValue = assetFileValue || assetAvatarValue || "";

    const assetNameValue = nameData?.[0]?.value?.value || '';
    const assetNameId = nameData?.[0]?.id;
    const assetTickerValue = tickerData?.[0]?.value?.value || '';
    const assetTickerId = tickerData?.[0]?.id;
    const assetDescriptionValue = assetDescriptionData?.[0]?.value?.value || "";
    const assetDescriptionId = assetDescriptionData?.[0]?.id;
    console.log({data});



    const [assetName, setAssetName] = useState(assetNameValue);
    const [assetTicker, setAssetTicker] = useState(assetTickerValue);
    const [assetDescription, setAssetDescription] = useState(assetDescriptionValue);
    const [assetFile, setAssetFile] = useState(assetFileValue);
    const [assetAvatar, setAssetAvatar] = useState(assetAvatarValue);
    const [assetSrc, setAssetSrc] = useState(assetSrcValue);


    useEffect( () => {
      console.log('useEffect: assetName');
      console.log({assetNameId, assetName});
      const insertUpdateAssetName = async () => {
        if (!assetNameId) {
          const { data: [{ id: _assetNameId }] } = await deep.insert({
            type_id: assetNameId,
            from_id: link.id,
            to_id: link.id,
            string: { data: { value: assetName } },
          })
          assetNameId = _assetNameId;
        } else {
          const { data: [{ link: _assetNameId }] } = await deep.update(
            { link_id: assetNameId },
            { value: assetName },
            { table: 'strings', returning: `link { ${deep.selectReturning} }` }
          );
        }
      }
      insertUpdateAssetName();
    }, [assetName]);

    useEffect( () => {
      console.log('useEffect: assetDescription');
      console.log({assetDescriptionId, assetDescription});
      const insertUpdateAssetDescription = async () => {
        if (!assetDescriptionId) {
          const { data: [{ id: _assetDescriptionId }] } = await deep.insert({
            type_id: assetDescriptionId,
            from_id: link.id,
            to_id: link.id,
            string: { data: { value: assetDescription } },
          })
          assetDescriptionId = _assetDescriptionId;
          deep.minilinks.apply([_assetDescriptionId]);
        } else {
          const { data: [{ link: _assetDescriptionId }] } = await deep.update(
            { link_id: assetDescriptionId },
            { value: assetDescription },
            { table: 'strings', returning: `link { ${deep.selectReturning} }` }
          );
          console.log({_assetDescriptionId});
        }
      }
      insertUpdateAssetDescription();
    }, [assetDescription]);

    useEffect( () => {
      const insertUpdateAssetTicker = async () => {
        if (!assetTickerId) {
          const { data: [{ id: _assetTickerId }] } = await deep.insert({
            type_id: assetTickerId,
            from_id: link.id,
            to_id: link.id,
            string: { data: { value: assetTicker } },
          })
          assetTickerId = _assetTickerId;
        } else {
          const { data: [{ link: _assetTickerId }] } = await deep.update(
            { link_id: assetTickerId },
            { value: assetTicker },
            { table: 'strings', returning: `link { ${deep.selectReturning} }` }
          );
        }
      }
      insertUpdateAssetTicker();
    }, [assetTicker]);

    useEffect( () => {
      const insertUpdateAssetAvatar = async () => {
        if (!assetAvatarId) {
          const { data: [{ id: _assetAvatarId }] } = await deep.insert({
            type_id: assetAvatarId,
            from_id: link.id,
            to_id: link.id,
            string: { data: { value: assetAvatar } },
          })
          assetAvatarId = _assetAvatarId;
        } else {
          const { data: [{ link: _assetAvatarId }] } = await deep.update(
            { link_id: assetAvatarId },
            { value: assetAvatar },
            { table: 'strings', returning: `link { ${deep.selectReturning} }` }
          );
        }
      }
      insertUpdateAssetAvatar();
    }, [assetAvatar]);


    return <div>
      <Box maxW='sm' minW='sm' w='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' p='4' backgroundColor='white'>
        <div>
          <Flex
            align="center"
            justify="center"
          >
            <Avatar size='2xl' name='' src={assetSrc} mb='1' />
          </Flex>
        </div>
        <Editable placeholder="Insert name" value={assetName} onChange={async (value) => {
          setAssetName(value)
        }}>
          <EditablePreview w={'100%'} />
          <EditableInput />
        </Editable>
        <Editable placeholder="Insert ticker" value={assetTicker} onChange={async (value) => {
          setAssetTicker(value)
        }}>
          <EditablePreview w={'100%'} />
          <EditableInput />
        </Editable>
        <Editable placeholder="Insert description" value={assetDescription} onChange={async (value) => {
          setAssetDescription(value)
        }}>
          <EditablePreview w={'100%'} />
          <EditableTextarea />
        </Editable>
        <Divider />
        <Editable placeholder="Insert avatar url" value={assetAvatar} onChange={async (value) => {
          setAssetAvatar(value);
          const newSrc = assetFile || value || undefined;
          setAssetSrc(newSrc);
        }}>
          <EditablePreview w={'100%'} />
          <EditableInput />
        </Editable>
      </Box>
    </div>;
  }
}