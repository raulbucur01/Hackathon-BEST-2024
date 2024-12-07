import yaml
from pathlib import Path
from typing import Dict, Any

def load_config_yaml_file(config_yaml_file_path: Path) -> Dict[str, Any]:
    """
        The function loads the config yaml file.

        Args:
            config_yaml_file_path: Path to the yaml file.
        Returns:
            config_yaml_content: dictionary with the yaml file content
    """

    config_yaml_content = {}
    try:
        config_yaml_content = yaml.safe_load(config_yaml_file_path.open(mode='r'))
    except yaml.YAMLError:
        print(f'Error loading {config_yaml_file_path}')

    if not config_yaml_content:
        raise ValueError(f'No data in config yaml!')

    return config_yaml_content